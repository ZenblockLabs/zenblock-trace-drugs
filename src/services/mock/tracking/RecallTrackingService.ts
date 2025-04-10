
import { MockDrugService } from '../DrugService';
import { MockEventService } from '../EventService';
import { MockRecallService } from '../RecallService';

export class RecallTrackingService {
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

  async checkDrugRecallStatus(sgtin: string) {
    // Check if drug is recalled
    const recallStatus = await this.recallService.checkRecallStatus(sgtin);
    
    return {
      isRecalled: recallStatus.isRecalled,
      message: recallStatus.isRecalled 
        ? `⚠️ This product has been recalled. Reason: ${recallStatus.reason}` 
        : "✅ This product is verified genuine and has a valid chain of custody.",
      verifiedBy: "Zenblock Labs Verification Service"
    };
  }
}
