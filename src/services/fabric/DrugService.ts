
import { Drug } from '../types';
import { ChainCodeService } from './ChainCodeService';

export class DrugService extends ChainCodeService {
  /**
   * Register a new drug in the blockchain
   */
  async registerDrug(drugData: any): Promise<Drug> {
    console.log('DrugService.registerDrug called with:', drugData);
    
    const data = await this.callChaincode('RegisterDrug', [JSON.stringify(drugData)]);
    return data as Drug;
  }

  /**
   * Get all drugs from the blockchain
   */
  async getAllDrugs(): Promise<Drug[]> {
    console.log('DrugService.getAllDrugs called');
    
    const data = await this.callChaincode('GetAllDrugs', []);
    return data as Drug[];
  }

  /**
   * Get drugs by owner ID
   */
  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    console.log('DrugService.getDrugsByOwner called for:', ownerId);
    
    const data = await this.callChaincode('GetDrugsByOwner', [ownerId]);
    return data as Drug[];
  }

  /**
   * Get drug by ID
   */
  async getDrugById(id: string): Promise<Drug | null> {
    console.log('DrugService.getDrugById called for:', id);
    
    const data = await this.callChaincode('ReadDrug', [id]);
    return data as Drug;
  }

  /**
   * Get drug by SGTIN
   */
  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    console.log('DrugService.getDrugBySGTIN called for:', sgtin);
    
    const data = await this.callChaincode('GetDrugBySGTIN', [sgtin]);
    return data as Drug;
  }

  /**
   * Get detailed drug information by SGTIN for public tracking
   */
  async getDrugDetailsBySGTIN(sgtin: string): Promise<any> {
    try {
      const { data, error } = await this.invokeFunction('track-drug', {
        body: { code: sgtin }
      });

      if (error) {
        console.error("Error fetching drug tracking data:", error);
        throw new Error(`Failed to get drug details: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error in getDrugDetailsBySGTIN:", error);
      throw error;
    }
  }
}
