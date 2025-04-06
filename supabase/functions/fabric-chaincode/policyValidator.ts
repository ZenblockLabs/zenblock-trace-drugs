
import { DrugStatus } from './types.ts';

// Validate that the current owner can transfer the drug
export const validateTransferPolicy = (drugData: any, transferData: any) => {
  // Policy 1: Only current owner can transfer
  if (drugData.currentOwnerId !== transferData.fromId) {
    throw new Error("Policy violation: Only the current owner can transfer a drug");
  }

  // Policy 2: Drug must be in a valid status for transfer
  const validStatusForTransfer = ['manufactured', 'received', 'in-transit'];
  if (!validStatusForTransfer.includes(drugData.status)) {
    throw new Error("Policy violation: Drug must be in manufactured, received, or in-transit status to be transferred");
  }

  // Policy 3: Valid supply chain flow based on roles
  const validRoleTransitions: Record<string, string[]> = {
    'manufacturer': ['distributor'],
    'distributor': ['distributor', 'dispenser', 'pharmacy'],
    'dispenser': ['patient'],
    'pharmacy': ['patient']
  };
  
  const validReceivers = validRoleTransitions[drugData.currentOwnerRole] || [];
  if (!validReceivers.includes(transferData.toRole)) {
    throw new Error(`Policy violation: A ${drugData.currentOwnerRole} can only transfer drugs to: ${validReceivers.join(', ')}`);
  }

  return true;
};

// Validate that the receiver can receive the drug
export const validateReceivePolicy = (drugData: any, receiveData: any) => {
  // Policy 1: Only the intended recipient can receive
  if (drugData.currentOwnerId !== receiveData.receiverId) {
    throw new Error("Policy violation: Only the intended recipient can receive a drug");
  }

  // Policy 2: Drug must be in a valid status for receiving
  const validStatusForReceive = ['shipped', 'in-transit'];
  if (!validStatusForReceive.includes(drugData.status)) {
    throw new Error("Policy violation: Drug must be in shipped or in-transit status to be received");
  }

  return true;
};
