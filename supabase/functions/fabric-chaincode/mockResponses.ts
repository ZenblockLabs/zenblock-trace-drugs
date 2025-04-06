
import { mockDrugs, mockEvents } from './mockData.ts';
import { validateTransferPolicy, validateReceivePolicy } from './policyValidator.ts';
import { Drug, TrackingEvent, DrugStatus, EventType } from './types.ts';

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
          status: 'manufactured' as DrugStatus,
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
    
    case 'LogEvent':
      try {
        const { sgtin, eventType, metadata } = JSON.parse(args[0]);
        const drug = mockDrugs.find(d => d.sgtin === sgtin);
        
        if (!drug) {
          throw new Error("Drug not found");
        }
        
        const newEvent: TrackingEvent = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          drugId: drug.id,
          eventType: eventType as EventType,
          location: metadata.location || 'Unknown',
          actor: {
            id: metadata.actorId,
            name: metadata.actorName,
            role: metadata.actorRole,
            organization: metadata.actorOrganization || metadata.actorName
          },
          details: metadata
        };
        
        // Update drug status based on event
        if (eventType === 'recall') {
          drug.status = 'recalled';
        }
        
        mockEvents.push(newEvent);
        return newEvent;
      } catch (error) {
        throw new Error(`Failed to log event: ${error.message}`);
      }
    
    case 'TransferOwnership':
      try {
        const { sgtin, from, to, details } = JSON.parse(args[0]);
        
        // Find the drug
        const drugToTransfer = mockDrugs.find(d => d.sgtin === sgtin);
        if (!drugToTransfer) {
          throw new Error("Drug not found");
        }
        
        // Validate the transfer (from matches current owner)
        if (drugToTransfer.currentOwnerId !== from.id) {
          throw new Error("Current owner ID does not match the sender ID");
        }
        
        // Create ship event
        const transferEvent: TrackingEvent = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          drugId: drugToTransfer.id,
          eventType: 'ship',
          location: details.location || 'Unknown',
          actor: {
            id: from.id,
            name: from.name,
            role: from.role,
            organization: from.organization || from.name
          },
          details: {
            destination: to.name,
            ...details
          }
        };
        
        mockEvents.push(transferEvent);
        
        // Update drug status and owner
        drugToTransfer.status = 'in-transit';
        drugToTransfer.currentOwnerId = to.id;
        drugToTransfer.currentOwnerName = to.name;
        drugToTransfer.currentOwnerRole = to.role;
        
        return {
          success: true,
          drug: drugToTransfer,
          event: transferEvent
        };
      } catch (error) {
        throw new Error(`Failed to transfer ownership: ${error.message}`);
      }
    
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
    
    case 'GetDrugHistory':
      try {
        const sgtin = args[0];
        
        // Find the drug
        const drug = mockDrugs.find(d => d.sgtin === sgtin);
        if (!drug) {
          return [];
        }
        
        // Return all events related to this drug
        return mockEvents
          .filter(event => event.drugId === drug.id)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
      } catch (error) {
        throw new Error(`Failed to get drug history: ${error.message}`);
      }
      
    default:
      throw new Error(`Unknown chaincode function: ${fcn}`);
  }
};
