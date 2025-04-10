
import { DrugStatus, TrackingEvent } from '../types';
import { mockEvents } from './mockEvents';

// A utility function to generate the current status of a drug based on its most recent event
export function computeDrugStatus(drugId: string): {
  status: DrugStatus;
  currentOwnerId: string;
  currentOwnerName: string;
  currentOwnerRole: string;
} {
  // Get all events for this drug
  const drugEvents = mockEvents.filter(event => event.drugId === drugId);
  
  // Default values if no events found
  if (drugEvents.length === 0) {
    return {
      status: 'manufactured',
      currentOwnerId: '',
      currentOwnerName: 'Unknown',
      currentOwnerRole: 'unknown'
    };
  }
  
  // Sort events by timestamp (newest first)
  const sortedEvents = [...drugEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Get most recent event
  const latestEvent = sortedEvents[0];
  
  // Map event type to status
  let status: DrugStatus;
  switch (latestEvent.type) {
    case 'commission':
    case 'qa-passed':
      status = 'manufactured';
      break;
    case 'ship':
      status = 'shipped';
      break;
    case 'receive':
      status = 'received';
      break;
    case 'warehouse':
      status = 'received'; // Map warehouse to received as it's not in DrugStatus
      break;
    case 'dispense':
      status = 'dispensed';
      break;
    case 'recall':
      status = 'recalled';
      break;
    default:
      status = 'manufactured';
  }
  
  // Extract actor information
  const actor = latestEvent.actor;
  const actorId = typeof actor === 'string' ? actor : actor.id || '';
  const actorName = typeof actor === 'string' ? 'Unknown' : actor.name;
  const actorRole = typeof actor === 'string' ? 'unknown' : actor.role;
  
  return {
    status,
    currentOwnerId: actorId,
    currentOwnerName: actorName,
    currentOwnerRole: actorRole
  };
}

// Function to filter events based on user role
export function filterEventsByRole(events: TrackingEvent[], role: string): TrackingEvent[] {
  if (role === 'regulator') {
    // Regulators see everything
    return events;
  }
  
  // Define which event types each role can see
  const roleEventMap: Record<string, string[]> = {
    'manufacturer': ['commission', 'qa-passed', 'ship'],
    'distributor': ['receive', 'warehouse', 'ship'],
    'dispenser': ['receive', 'warehouse', 'dispense']
  };
  
  const allowedTypes = roleEventMap[role] || [];
  
  // Filter events by role
  return events.filter(event => {
    // Convert the event type to a standard format
    const eventType = event.type.toLowerCase();
    return allowedTypes.includes(eventType);
  });
}
