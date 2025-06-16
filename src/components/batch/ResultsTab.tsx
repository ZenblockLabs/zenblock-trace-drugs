
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface ScannedItem {
  sgtin: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'error';
}

interface ResultsTabProps {
  scannedItems: ScannedItem[];
  handleVerifyAll: () => void;
  handleDemoScan: () => void;
}

export const ResultsTab = ({ scannedItems, handleVerifyAll, handleDemoScan }: ResultsTabProps) => {
  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>
              {scannedItems.length} items processed in this session
            </CardDescription>
          </div>
          {scannedItems.some(item => item.status === 'pending') && (
            <Button onClick={handleVerifyAll} size="sm">
              Verify All Pending
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {scannedItems.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">SGTIN</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-2 text-xs font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {scannedItems.map((item, index) => (
                    <tr key={index} className="text-sm">
                      <td className="p-2 font-mono">{item.sgtin}</td>
                      <td className="p-2">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-2">
                        {item.status === 'verified' && (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            Pending
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            Error
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          Details <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No items have been scanned yet</p>
              <Button variant="outline" onClick={handleDemoScan}>
                Generate Sample Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
