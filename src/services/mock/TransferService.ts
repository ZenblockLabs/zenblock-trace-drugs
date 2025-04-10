
import { MockDrugService } from './DrugService';
import { MockEventService } from './EventService';

export class MockTransferService {
  private drugService: MockDrugService;
  private eventService: MockEventService;

  constructor(drugService: MockDrugService, eventService: MockEventService) {
    this.drugService = drugService;
    this.eventService = eventService;
  }

  async transferDrug(
    drugId: string, 
    fromId: string, 
    toId: string, 
    toName: string, 
    toRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    const drug = await this.drugService.getDrugById(drugId);
    if (!drug) {
      return false;
    }

    // Create a transfer event
    await this.eventService.createEvent({
      drugId: drugId,
      type: 'ship',
      timestamp: new Date().toISOString(),
      location: location,
      actor: {
        id: fromId,
        name: drug.currentOwnerName,
        role: drug.currentOwnerRole
      },
      details: {
        toId: toId,
        toName: toName,
        toRole: toRole,
        ...details
      }
    });

    return true;
  }

  async receiveDrug(
    drugId: string, 
    receiverId: string, 
    receiverName: string, 
    receiverRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    const drug = await this.drugService.getDrugById(drugId);
    if (!drug) {
      return false;
    }

    // Create a receive event
    await this.eventService.createEvent({
      drugId: drugId,
      type: 'receive',
      timestamp: new Date().toISOString(),
      location: location,
      actor: {
        id: receiverId,
        name: receiverName,
        role: receiverRole
      },
      details: {
        notes: `Received by ${receiverName} (${receiverRole})`,
        ...details
      }
    });

    return true;
  }
}
