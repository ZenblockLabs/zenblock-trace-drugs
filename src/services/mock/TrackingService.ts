
import { MockDrugService } from './DrugService';
import { MockEventService } from './EventService';
import { MockRecallService } from './RecallService';
import { DrugTraceability } from '../types';

export class MockTrackingService {
  private drugService: MockDrugService;
  private eventService: MockEventService;
  private recallService: MockRecallService;

  constructor(
    drugService: MockDrugService, 
    eventService: MockEventService,
    recallService: MockRecallService
  ) {
    this.drugService = drugService;
    this.eventService = eventService;
    this.recallService = recallService;
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<DrugTraceability | null> {
    const drug = await this.drugService.getDrugBySGTIN(sgtin);
    
    if (!drug) {
      return null;
    }
    
    // Get events for this drug
    const allEvents = await this.eventService.getEventsByDrug(drug.id);
    
    // Sort events by timestamp
    const sortedEvents = [...allEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Check if drug is recalled
    const recallStatus = await this.recallService.checkRecallStatus(sgtin);
    
    // Format the response as expected by the tracking UI
    return {
      drug: {
        name: drug.productName || '',
        manufacturer: drug.manufacturerName,
        batchId: drug.batchNumber,
        expiry: drug.expiryDate,
        license: drug.id, // Using ID as a stand-in for license
        sgtin: drug.sgtin
      },
      events: sortedEvents.map(event => ({
        step: event.type.charAt(0).toUpperCase() + event.type.slice(1),
        timestamp: event.timestamp,
        location: event.location || '',
        handler: typeof event.actor === 'string' ? event.actor : event.actor.name,
        notes: event.details?.notes || ''
      })),
      status: {
        isRecalled: recallStatus.isRecalled,
        message: recallStatus.isRecalled 
          ? `⚠️ This product has been recalled. Reason: ${recallStatus.reason}` 
          : "✅ This product is verified genuine and has a valid chain of custody.",
        verifiedBy: "Zenblock Labs Verification Service"
      }
    };
  }

  async getLatestComplianceReport(): Promise<any> {
    return {
      id: 'comp1',
      title: 'Q1 2023 Compliance Report',
      period: 'Q1 2023',
      timestamp: new Date().toISOString(),
      violations: 3,
      complianceScore: 92.5,
      details: {
        totalTransactions: 120,
        successfulValidations: 117,
        recommendations: 'Improve temperature tracking during transit'
      }
    };
  }
}
