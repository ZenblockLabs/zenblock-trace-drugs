
import { supabase } from '@/integrations/supabase/client';
import { ChainCodeService } from './ChainCodeService';

export class RecallService extends ChainCodeService {
  /**
   * Initiate a drug recall
   */
  async initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean> {
    console.log('RecallService.initiateRecall called with:', { sgtin, reason, initiator });
    
    const recallData = {
      sgtin,
      reason,
      initiatedBy: initiator,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Invoke chaincode to initiate recall
      const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
        body: { 
          action: 'invoke',
          chaincodeFcn: 'InitiateRecall',
          args: [JSON.stringify(recallData)]
        }
      });
      
      if (error) {
        console.error('Error initiating recall via chaincode:', error);
        throw new Error(`Failed to initiate recall: ${error.message}`);
      }
      
      return data.success as boolean;
    } catch (err) {
      console.error('Error initiating recall:', err);
      throw err;
    }
  }

  /**
   * Check recall status for a drug
   */
  async checkRecallStatus(sgtin: string): Promise<any> {
    console.log('RecallService.checkRecallStatus called for:', sgtin);
    
    try {
      // Query chaincode for recall status
      const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
        body: { 
          action: 'query',
          chaincodeFcn: 'IsRecalled',
          args: [sgtin]
        }
      });
      
      if (error) {
        console.error('Error checking recall status via chaincode:', error);
        throw new Error(`Failed to check recall status: ${error.message}`);
      }
      
      return data;
    } catch (err) {
      console.error('Error checking recall status:', err);
      throw err;
    }
  }
}
