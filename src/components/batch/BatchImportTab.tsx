
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, BarChart3 } from 'lucide-react';

interface BatchImportTabProps {
  setBatchModalOpen: (value: boolean) => void;
}

export const BatchImportTab = ({ setBatchModalOpen }: BatchImportTabProps) => {
  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Drug Import</CardTitle>
          <CardDescription>
            Process multiple drugs at once with batch operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center h-40">
                  <Upload className="h-10 w-10 text-muted-foreground/60 mb-4" />
                  <h3 className="text-lg font-medium">Batch Scanning</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    Scan multiple barcodes in sequence
                  </p>
                  <Button onClick={() => setBatchModalOpen(true)}>Start Batch Import</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center h-40">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/60 mb-4" />
                  <h3 className="text-lg font-medium">Analytics</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    Review batch processing statistics
                  </p>
                  <Button variant="outline">View Reports</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
