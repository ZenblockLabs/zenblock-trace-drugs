
import { ApiService } from './ApiService';

export class ChainCodeService extends ApiService {
  /**
   * Calls a chaincode function on the Fabric network
   */
  async callChaincode(functionName: string, args: any = {}): Promise<any> {
    try {
      const response = await this.invokeFunction('fabric-chaincode', {
        method: 'POST',
        body: {
          functionName,
          args
        }
      });
      
      if (response.error) {
        throw new Error(`Chaincode error: ${response.error.message}`);
      }
      
      return response.data;
    } catch (err) {
      console.error(`Error calling chaincode function ${functionName}:`, err);
      throw err;
    }
  }
}
