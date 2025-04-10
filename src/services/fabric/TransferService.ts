
import { ChainCodeService } from './ChainCodeService';

export class TransferService extends ChainCodeService {
  /**
   * Transfer a drug from one owner to another
   */
  async transferDrug(
    drugId: string, 
    fromId: string, 
    toId: string, 
    toName: string, 
    toRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    console.log('TransferService.transferDrug called with:', { drugId, fromId, toId });
    
    const transferData = {
      drugId,
      fromId,
      toId,
      toName,
      toRole,
      location,
      details
    };
    
    const data = await this.callChaincode('TransferDrug', [JSON.stringify(transferData)]);
    return data as boolean;
  }

  /**
   * Receive a drug
   */
  async receiveDrug(
    drugId: string, 
    receiverId: string, 
    receiverName: string, 
    receiverRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    console.log('TransferService.receiveDrug called with:', { drugId, receiverId });
    
    const receiveData = {
      drugId,
      receiverId,
      receiverName,
      receiverRole,
      location,
      details
    };
    
    const data = await this.callChaincode('ReceiveDrug', [JSON.stringify(receiveData)]);
    return data as boolean;
  }
}
