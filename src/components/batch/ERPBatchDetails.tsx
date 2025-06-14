
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ERPBatch {
  batchId: string;
  drugName: string;
  quantity: number;
  status: string;
  createdAt: string;
  facility: string;
}

interface ERPBatchDetailsProps {
  userRole: string;
}

export const ERPBatchDetails = ({ userRole }: ERPBatchDetailsProps) => {
  const [batches, setBatches] = useState<ERPBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchERPBatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - in production this would be a real external ERP API
      const response = await fetch(`/api/erp/batches?role=${userRole.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ERP data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBatches(data);
      toast.success('ERP batch data refreshed successfully');
    } catch (err) {
      // Since we don't have a real ERP API, let's use mock data based on role
      const mockData = generateMockERPData(userRole);
      setBatches(mockData);
      setError('Using mock ERP data (external API not available)');
      toast.info('Displaying mock ERP data');
    } finally {
      setLoading(false);
    }
  };

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

    // Customize data based on role
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
          quantity: Math.floor(batch.quantity / 10) // Dispensers have smaller quantities
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

  useEffect(() => {
    fetchERPBatches();
  }, [userRole]);

  const getStatusBadgeVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('ready') || lowerStatus.includes('dispatched') || lowerStatus.includes('dispensed')) {
      return 'success';
    } else if (lowerStatus.includes('transit') || lowerStatus.includes('production') || lowerStatus.includes('incoming')) {
      return 'default';
    } else if (lowerStatus.includes('review') || lowerStatus.includes('check')) {
      return 'secondary';
    }
    return 'outline';
  };

  const getRoleSpecificTitle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manufacturer':
        return 'Manufacturing Batch Queue';
      case 'distributor':
        return 'Distribution Batch Tracking';
      case 'dispenser':
        return 'Pharmacy Stock Batches';
      case 'regulator':
        return 'Regulatory Batch Overview';
      default:
        return 'Batch Details';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Batch Details from ERP</CardTitle>
          <CardDescription>
            {getRoleSpecificTitle(userRole)} - Real-time data from external ERP system
          </CardDescription>
        </div>
        <Button 
          onClick={fetchERPBatches} 
          disabled={loading}
          variant="outline" 
          size="sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading ERP batch data...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Facility</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.length > 0 ? (
                  batches.map((batch) => (
                    <TableRow key={batch.batchId}>
                      <TableCell className="font-mono text-sm">{batch.batchId}</TableCell>
                      <TableCell className="font-medium">{batch.drugName}</TableCell>
                      <TableCell>{batch.quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(batch.status)}>
                          {batch.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{batch.facility}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No batch data available for {userRole.toLowerCase()}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
