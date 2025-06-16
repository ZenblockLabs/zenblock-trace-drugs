
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ERPBatch {
  batchId: string;
  drugName: string;
  quantity: number;
  status: string;
  createdAt: string;
  facility: string;
}

export const useERPBatchData = (userRole: string) => {
  const [batches, setBatches] = useState<ERPBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateMockERPData = (role: string): ERPBatch[] => {
    const baseData = [
      {
        batchId: "BATCH-X90",
        drugName: "Amoxicillin 500mg",
        quantity: 2000,
        status: "Ready for QA",
        createdAt: "2025-06-10",
        facility: "Baddi Plant"
      },
      {
        batchId: "BATCH-Y45",
        drugName: "Paracetamol 650mg",
        quantity: 1500,
        status: "In Production",
        createdAt: "2025-06-11",
        facility: "Mumbai Facility"
      },
      {
        batchId: "BATCH-Z12",
        drugName: "Ibuprofen 400mg",
        quantity: 3000,
        status: "Quality Check",
        createdAt: "2025-06-09",
        facility: "Delhi Unit"
      }
    ];

    switch (role.toLowerCase()) {
      case 'manufacturer':
        return baseData.map(batch => ({
          ...batch,
          status: ['In Production', 'Ready for QA', 'Quality Check'][Math.floor(Math.random() * 3)]
        }));
      
      case 'distributor':
        return baseData.map(batch => ({
          ...batch,
          status: ['Received', 'In Transit', 'Dispatched'][Math.floor(Math.random() * 3)],
          facility: 'Distribution Center'
        }));
      
      case 'dispenser':
        return baseData.map(batch => ({
          ...batch,
          status: ['Incoming Stock', 'In Inventory', 'Dispensed'][Math.floor(Math.random() * 3)],
          facility: 'Pharmacy Stock',
          quantity: Math.floor(batch.quantity / 10)
        }));
      
      case 'regulator':
        return [
          ...baseData,
          {
            batchId: "BATCH-R99",
            drugName: "Controlled Substance A",
            quantity: 500,
            status: "Under Review",
            createdAt: "2025-06-08",
            facility: "Regulated Facility"
          }
        ];
      
      default:
        return baseData;
    }
  };

  const fetchERPBatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/erp/batches?role=${userRole.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ERP data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBatches(data);
      toast.success('ERP batch data refreshed successfully');
    } catch (err) {
      const mockData = generateMockERPData(userRole);
      setBatches(mockData);
      setError('Using mock ERP data (external API not available)');
      toast.info('Displaying mock ERP data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchERPBatches();
  }, [userRole]);

  return {
    batches,
    loading,
    error,
    fetchERPBatches
  };
};
