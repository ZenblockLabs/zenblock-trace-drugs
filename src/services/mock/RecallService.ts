
import { MockDrugService } from './DrugService';
import { MockEventService } from './EventService';
import { Actor } from '../types';

export class MockRecallService {
  private drugService: MockDrugService;
  private eventService: MockEventService;

  constructor(drugService: MockDrugService, eventService: MockEventService) {
    this.drugService = drugService;
    this.eventService = eventService;
  }

  async initiateRecall(sgtin: string, reason: string, initiator: string | Actor): Promise<boolean> {
    const drug = await this.drugService.getDrugBySGTIN(sgtin);
    if (!drug) {
      return false;
    }

    // Create a recall event
    await this.eventService.createEvent({
      drugId: drug.id,
      type: 'recall',
      timestamp: new Date().toISOString(),
      location: 'System',
      actor: typeof initiator === 'string' 
        ? {
            id: initiator,
            name: 'Regulatory Authority',
            role: 'regulator'
          }
        : initiator,
      details: {
        reason,
        recallId: Math.random().toString(36).substring(2, 10)
      }
    });

    return true;
  }

  async checkRecallStatus(sgtin: string): Promise<{ isRecalled: boolean; reason: string }> {
    const drug = await this.drugService.getDrugBySGTIN(sgtin);
    if (!drug) {
      return { isRecalled: false, reason: '' };
    }

    // Get all events for this drug
    const allEvents = await this.eventService.getEventsByDrug(drug.id);
    
    // Check if there are any recall events for this drug
    const recallEvents = allEvents.filter(e => e.type.toLowerCase() === 'recall');

    if (recallEvents.length > 0) {
      // Sort by timestamp (newest first) to get the most recent recall
      const latestRecall = recallEvents.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

      return {
        isRecalled: true,
        reason: latestRecall.details.reason || 'Unspecified reason'
      };
    }

    return { isRecalled: false, reason: '' };
  }
}
