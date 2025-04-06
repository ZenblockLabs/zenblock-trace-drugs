
import { mockDrugs, mockEvents } from './mockData.ts';
import { validateTransferPolicy, validateReceivePolicy } from './policyValidator.ts';

// Mock function to simulate chaincode responses
export const mockChaincodeResponse = (fcn: string, args: string[]) => {
  switch (fcn) {
    case 'RegisterDrug':
      try {
        const drugData = JSON.parse(args[0]);
        return {
          id: crypto.randomUUID(),
          gtin: drugData.gtin,
          sgtin: `sgtin:${drugData.gtin}.${Math.floor(Math.random() * 1000000)}`,
          batchNumber: drugData.batchNumber,
          manufacturerId: drugData.manufacturerId,
          manufacturerName: drugData.manufacturerName,
          expiryDate: drugData.expiryDate,
          productName: drugData.productName,
          dosage: drugData.dosage,
          description: drugData.description,
          status: 'manufactured',
          currentOwnerId: drugData.manufacturerId,
          currentOwnerName: drugData.manufacturerName,
          currentOwnerRole: 'manufacturer'
        };
      } catch (error) {
        throw new Error(`Failed to parse drug data: ${error.message}`);
      }
    
    case 'GetAllDrugs':
      return mockDrugs;
    
    case 'GetDrugsByOwner':
      const ownerId = args[0];
      return mockDrugs.filter(drug => drug.currentOwnerId === ownerId);
    
    case 'ReadDrug':
      const drugId = args[0];
      const drug = mockDrugs.find(d => d.id === drugId);
      return drug || null;
    
    case 'GetDrugBySGTIN':
      const sgtin = args[0];
      const drugBySGTIN = mockDrugs.find(d => d.sgtin === sgtin);
      return drugBySGTIN || null;
    
    case 'CreateEvent':
      try {
        const eventData = JSON.parse(args[0]);
        const newEvent = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          ...eventData
        };
        return newEvent;
      } catch (error) {
        throw new Error(`Failed to parse event data: ${error.message}`);
      }
    
    case 'GetEventsByDrug':
      const eventDrugId = args[0];
      return mockEvents.filter(event => event.drugId === eventDrugId);
    
    case 'GetAllEvents':
      return mockEvents;
    
    case 'GetRecentEvents':
      const limit = parseInt(args[0]) || 10;
      return mockEvents.slice(0, limit);
    
    case 'TransferDrug':
      try {
        const transferData = JSON.parse(args[0]);
        
        // Find the drug to validate the transfer
        const drugToTransfer = mockDrugs.find(d => d.id === transferData.drugId);
        if (!drugToTransfer) {
          throw new Error("Drug not found");
        }
        
        // Validate transfer policies
        validateTransferPolicy(drugToTransfer, transferData);
        
        // In a real implementation, this would update the state in the ledger
        // For our mock, we'll update the drug in our mock data
        drugToTransfer.status = 'in-transit';
        drugToTransfer.currentOwnerId = transferData.toId;
        drugToTransfer.currentOwnerName = transferData.toName;
        drugToTransfer.currentOwnerRole = transferData.toRole;
        
        return true;
      } catch (error) {
        throw new Error(`Failed to transfer drug: ${error.message}`);
      }
    
    case 'ReceiveDrug':
      try {
        const receiveData = JSON.parse(args[0]);
        
        // Find the drug to validate the receive
        const drugToReceive = mockDrugs.find(d => d.id === receiveData.drugId);
        if (!drugToReceive) {
          throw new Error("Drug not found");
        }
        
        // Validate receive policies
        validateReceivePolicy(drugToReceive, receiveData);
        
        // In a real implementation, this would update the state in the ledger
        // For our mock, we'll update the drug in our mock data
        drugToReceive.status = 'received';
        
        return true;
      } catch (error) {
        throw new Error(`Failed to receive drug: ${error.message}`);
      }
    
    default:
      throw new Error(`Unknown chaincode function: ${fcn}`);
  }
};
