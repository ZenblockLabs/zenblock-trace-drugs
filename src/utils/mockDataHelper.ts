
import { Drug, TrackingEvent, DrugStatus } from '../services/types';

// Create a local copy of the mock data to avoid circular imports
export { mockDrugs, mockEvents, computeDrugStatus, filterEventsByRole } from '../services/mockData';

// Utility function to get richer event metadata for a drug
export function getEnhancedEventDetails(drugId: string) {
  const { mockEvents } = require('../services/mockData');
  const events = mockEvents.filter((event: TrackingEvent) => event.drugId === drugId);
  
  return events.map((event: TrackingEvent) => {
    // Extract temperature data if available
    const temperatureData = event.details.temperatureLog || [];
    
    // Extract blockchain verification data
    const blockchainData = event.details.isOnChain ? {
      verified: true,
      hash: event.details.blockchainHash || 'unknown',
      blockHeight: event.details.blockHeight || 0,
      timestamp: event.details.verificationTimestamp || event.timestamp
    } : { verified: false };
    
    // Extract location data
    const locationData = event.details.geoCoordinates ? {
      coordinates: event.details.geoCoordinates,
      formattedAddress: event.location
    } : { formattedAddress: event.location };
    
    return {
      ...event,
      enhancedData: {
        temperature: temperatureData,
        blockchain: blockchainData,
        location: locationData,
        humidity: event.details.humidityPercentage || null,
        shockEvents: event.details.shockEvents || []
      }
    };
  });
}

// Utility function to get complete timeline for a drug
export function getDrugTimeline(sgtin: string) {
  const { mockDrugs, mockEvents } = require('../services/mockData');
  
  // Find the drug by SGTIN
  const drug = mockDrugs.find((d: Drug) => d.sgtin === sgtin);
  if (!drug) return null;
  
  // Get events for this drug
  const events = mockEvents.filter((event: TrackingEvent) => event.drugId === drug.id);
  
  // Sort events chronologically
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  return {
    drug,
    events: sortedEvents,
    hasCompleteJourney: hasCompleteDrugJourney(sortedEvents),
    hasAnomalies: hasSupplyChainAnomalies(sortedEvents)
  };
}

// Check if a drug has a complete journey through the supply chain
function hasCompleteDrugJourney(events: TrackingEvent[]): boolean {
  const requiredSteps = ['commission', 'qa-passed', 'ship', 'receive'];
  
  // Check if all required steps exist
  return requiredSteps.every(step => 
    events.some(event => event.type === step)
  );
}

// Check if there are anomalies in the supply chain
function hasSupplyChainAnomalies(events: TrackingEvent[]): boolean {
  // Check for missing events
  const steps = events.map(event => event.type);
  
  // If we have warehouse without receive, that's an anomaly
  if (steps.includes('warehouse') && !steps.includes('receive')) {
    return true;
  }
  
  // Check for temperature excursions
  const hasTemperatureExcursion = events.some(event => 
    event.details.temperatureCheckPassed === false
  );
  
  // Check for unusual shipping routes (e.g., manufacturer directly to pharmacy)
  const manufacturerShips = events.filter(event => 
    event.type === 'ship' && event.actor.role === 'manufacturer'
  );
  
  const directToPharmacy = manufacturerShips.some(event => 
    event.details.destination && 
    event.details.destination.toLowerCase().includes('pharmacy')
  );
  
  return hasTemperatureExcursion || directToPharmacy;
}
