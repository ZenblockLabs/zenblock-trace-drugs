
import { MockDrugService } from './DrugService';
import { MockEventService } from './EventService';
import { MockRecallService } from './RecallService';
import { DrugTraceability } from '../types/TrackingTypes';
import { ComplianceReport } from '../types';
import { DrugTrackingService } from './tracking/DrugTrackingService';
import { RecallTrackingService } from './tracking/RecallTrackingService';
import { ComplianceTrackingService } from './tracking/ComplianceTrackingService';

export class MockTrackingService {
  private drugTrackingService: DrugTrackingService;
  private complianceService: ComplianceTrackingService;

  constructor(
    drugService: MockDrugService, 
    eventService: MockEventService,
    recallService: MockRecallService
  ) {
    // Create specialized services
    const recallTrackingService = new RecallTrackingService(
      drugService, 
      eventService, 
      recallService
    );
    
    this.drugTrackingService = new DrugTrackingService(
      drugService, 
      eventService, 
      recallTrackingService
    );
    
    this.complianceService = new ComplianceTrackingService();
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<DrugTraceability | null> {
    return this.drugTrackingService.getDrugDetailsBySGTIN(sgtin);
  }

  async getLatestComplianceReport(): Promise<ComplianceReport> {
    return this.complianceService.getLatestComplianceReport();
  }
}
