
import { supabase } from '@/integrations/supabase/client';

export interface DrugRegistrationData {
  drugName: string;
  batchId: string;
  manufacturerName: string;
  manufacturerId: string;
  manufacturingDate: string;
  expiryDate: string;
  dosage: string;
  description?: string;
  gtin: string;
  serialNumbers: string[];
}

export interface ShipmentData {
  batchId: string;
  fromActorId: string;
  fromActorName: string;
  fromRole: string;
  toActorId: string;
  toActorName: string;
  toRole: string;
  location: string;
  timestamp: string;
  notes?: string;
}

export interface ReceiveData {
  batchId: string;
  receiverActorId: string;
  receiverActorName: string;
  receiverRole: string;
  location: string;
  timestamp: string;
  notes?: string;
}

export interface DispenseData {
  batchId: string;
  dispenserActorId: string;
  dispenserActorName: string;
  patientId?: string;
  location: string;
  timestamp: string;
  prescriptionId?: string;
  notes?: string;
}

export class DrugApiService {
  private async callApi(endpoint: string, method: 'GET' | 'POST' = 'POST', data?: any) {
    const options: any = {
      method,
    };

    if (data && method === 'POST') {
      options.body = data;
    }

    // Supabase client automatically includes the auth JWT in the Authorization header
    const { data: responseData, error } = await supabase.functions.invoke(`drug-api/${endpoint}`, options);

    if (error) {
      throw new Error(`API Error: ${error.message}`);
    }

    return responseData;
  }

  // Manufacturer APIs
  async registerDrug(drugData: DrugRegistrationData) {
    return this.callApi('register', 'POST', drugData);
  }

  async getDrugBatch(batchId: string) {
    return this.callApi(`batch?batchId=${batchId}`, 'GET');
  }

  // Distributor APIs
  async shipDrug(shipmentData: ShipmentData) {
    return this.callApi('ship', 'POST', shipmentData);
  }

  async receiveDrug(receiveData: ReceiveData) {
    return this.callApi('receive', 'POST', receiveData);
  }

  // Dispenser APIs
  async dispenseDrug(dispenseData: DispenseData) {
    return this.callApi('dispense', 'POST', dispenseData);
  }

  // Regulator APIs
  async getDrugHistory(batchId: string) {
    return this.callApi(`history?batchId=${batchId}`, 'GET');
  }

  async getComplianceStatus(batchId: string) {
    return this.callApi(`compliance-status?batchId=${batchId}`, 'GET');
  }
}

// Export singleton instance
export const drugApiService = new DrugApiService();
