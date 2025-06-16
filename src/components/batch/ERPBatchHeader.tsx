
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Link2, CloudUpload } from 'lucide-react';

interface ERPBatchHeaderProps {
  userRole: string;
  loading: boolean;
  batchCount: number;
  onRefresh: () => void;
  onSyncAll: () => void;
}

export const ERPBatchHeader = ({ 
  userRole, 
  loading, 
  batchCount, 
  onRefresh, 
  onSyncAll 
}: ERPBatchHeaderProps) => {
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
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          Batch Details from ERP
          <Badge variant="outline" className="text-xs">
            <Link2 className="h-3 w-3 mr-1" />
            Blockchain Sync Available
          </Badge>
        </CardTitle>
        <CardDescription>
          {getRoleSpecificTitle(userRole)} - Real-time data from external ERP system
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onRefresh} 
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
        {batchCount > 0 && (
          <Button 
            onClick={onSyncAll}
            disabled={loading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CloudUpload className="h-4 w-4 mr-1" />
            Sync All to Blockchain
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
