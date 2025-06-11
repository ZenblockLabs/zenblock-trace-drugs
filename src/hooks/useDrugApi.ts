
import { useState } from 'react';
import { drugApiService, DrugRegistrationData, ShipmentData, ReceiveData, DispenseData } from '@/services/DrugApiService';
import { toast } from 'sonner';

export function useDrugApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async (apiCall: () => Promise<any>, successMessage?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerDrug = async (drugData: DrugRegistrationData) => {
    return handleApiCall(
      () => drugApiService.registerDrug(drugData),
      'Drug registered successfully'
    );
  };

  const shipDrug = async (shipmentData: ShipmentData) => {
    return handleApiCall(
      () => drugApiService.shipDrug(shipmentData),
      'Drug shipment recorded successfully'
    );
  };

  const receiveDrug = async (receiveData: ReceiveData) => {
    return handleApiCall(
      () => drugApiService.receiveDrug(receiveData),
      'Drug receipt recorded successfully'
    );
  };

  const dispenseDrug = async (dispenseData: DispenseData) => {
    return handleApiCall(
      () => drugApiService.dispenseDrug(dispenseData),
      'Drug dispensing recorded successfully'
    );
  };

  const getDrugHistory = async (batchId: string) => {
    return handleApiCall(() => drugApiService.getDrugHistory(batchId));
  };

  const getComplianceStatus = async (batchId: string) => {
    return handleApiCall(() => drugApiService.getComplianceStatus(batchId));
  };

  const getDrugBatch = async (batchId: string) => {
    return handleApiCall(() => drugApiService.getDrugBatch(batchId));
  };

  return {
    loading,
    error,
    registerDrug,
    shipDrug,
    receiveDrug,
    dispenseDrug,
    getDrugHistory,
    getComplianceStatus,
    getDrugBatch
  };
}
