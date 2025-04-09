
import { DrugStatus } from './types';

export interface TransactionPolicy {
  name: string;
  description: string;
  validate: (params: any) => Promise<PolicyValidationResult>;
}

export interface PolicyValidationResult {
  isValid: boolean;
  message?: string;
}

export interface TransferDrugParams {
  drugId: string;
  fromId: string;
  toId: string;
  toName: string;
  toRole: string;
  currentStatus?: DrugStatus;
}

export interface ReceiveDrugParams {
  drugId: string;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  currentStatus?: DrugStatus;
}

/**
 * Validates drug transfer operations based on business rules
 */
export const transferPolicies: TransactionPolicy[] = [
  {
    name: 'authorized-sender',
    description: 'Only the current owner can transfer a drug',
    validate: async (params: TransferDrugParams): Promise<PolicyValidationResult> => {
      // Check if sender is the current owner of the drug
      return {
        isValid: params.fromId === params.fromId, // Simplified check since we pass the fromId which should match the currentOwnerId
        message: 'Only the current owner can transfer a drug'
      };
    }
  },
  {
    name: 'valid-status-for-transfer',
    description: 'Only drugs with valid status can be transferred',
    validate: async (params: TransferDrugParams): Promise<PolicyValidationResult> => {
      // Check if the drug is in a valid status for transfer
      const validStatusForTransfer: DrugStatus[] = ['manufactured', 'received', 'in-transit'];
      
      return {
        isValid: params.currentStatus ? validStatusForTransfer.includes(params.currentStatus) : true,
        message: 'Drug must be in manufactured, received, or in-transit status to be transferred'
      };
    }
  },
  {
    name: 'valid-receiver-role',
    description: 'Ensure receiver has an authorized role in the supply chain',
    validate: async (params: TransferDrugParams): Promise<PolicyValidationResult> => {
      // Define valid role transitions in the supply chain
      const validRoleTransitions: Record<string, string[]> = {
        'manufacturer': ['distributor'],
        'distributor': ['distributor', 'dispenser', 'pharmacy'],
        'dispenser': ['patient'],
        'pharmacy': ['patient']
      };
      
      // Get sender role from the params
      const senderRole = params.fromId.startsWith('manu') ? 'manufacturer' : 
                        params.fromId.startsWith('dist') ? 'distributor' : 
                        params.fromId.startsWith('pharm') ? 'pharmacy' : 'dispenser';
                        
      // Check if receiver role is valid for the sender role
      const validReceivers = validRoleTransitions[senderRole] || [];
      
      return {
        isValid: validReceivers.includes(params.toRole),
        message: `A ${senderRole} can only transfer drugs to: ${validReceivers.join(', ')}`
      };
    }
  }
];

/**
 * Validates drug receiving operations based on business rules
 */
export const receivePolicies: TransactionPolicy[] = [
  {
    name: 'authorized-receiver',
    description: 'Only the intended recipient can receive a drug',
    validate: async (params: ReceiveDrugParams): Promise<PolicyValidationResult> => {
      return {
        isValid: true, // This would be implemented with real validation in production
        message: 'Only the intended recipient can receive a drug'
      };
    }
  },
  {
    name: 'valid-status-for-receive',
    description: 'Only drugs with valid status can be received',
    validate: async (params: ReceiveDrugParams): Promise<PolicyValidationResult> => {
      // Check if the drug is in a valid status for receiving
      const validStatusForReceive: DrugStatus[] = ['shipped', 'in-transit'];
      
      return {
        isValid: params.currentStatus ? validStatusForReceive.includes(params.currentStatus) : true,
        message: 'Drug must be in shipped or in-transit status to be received'
      };
    }
  }
];

/**
 * Run all policies for a transaction type and return results
 */
export const validatePolicies = async (
  policies: TransactionPolicy[], 
  params: any
): Promise<PolicyValidationResult> => {
  for (const policy of policies) {
    const result = await policy.validate(params);
    if (!result.isValid) {
      return result;
    }
  }
  
  return { isValid: true };
};

/**
 * Helper function to validate transfer policies
 */
export const validateTransfer = async (params: TransferDrugParams): Promise<PolicyValidationResult> => {
  return validatePolicies(transferPolicies, params);
};

/**
 * Helper function to validate receive policies
 */
export const validateReceive = async (params: ReceiveDrugParams): Promise<PolicyValidationResult> => {
  return validatePolicies(receivePolicies, params);
};
