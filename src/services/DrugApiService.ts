
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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
  private getUserRole(): string {
    // Extract role from current user context
    const userData = JSON.parse(localStorage.getItem('zenblock_user') || '{}');
    return userData.role || 'unknown';
  }

  private getUserId(): string {
    const userData = JSON.parse(localStorage.getItem('zenblock_user') || '{}');
    return userData.id || 'unknown';
  }

  private async callApi(endpoint: string, method: 'GET' | 'POST' = 'POST', data?: any) {
    const headers: Record<string, string> = {
      'x-user-role': this.getUserRole(),
      'x-user-id': this.getUserId()
    };

    const options: any = {
      method,
      headers
    };

    if (data && method === 'POST') {
      options.body = data;
    }

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
