
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Globe, 
  Shield,
  FileText,
  Link2
} from 'lucide-react';
import { toast } from 'sonner';

interface InteroperabilityPanelProps {
  userRole: string;
}

export function InteroperabilityPanel({ userRole }: InteroperabilityPanelProps) {
  const [tatmeenEnabled, setTatmeenEnabled] = useState(false);
  const [vrsEnabled, setVrsEnabled] = useState(false);
  const [exportFormat, setExportFormat] = useState('gs1-xml');
  const [sgtin, setSgtin] = useState('');
  const [exportResult, setExportResult] = useState<string | null>(null);

  const handleTatmeenExport = async () => {
    try {
      toast.info('Exporting to Tatmeen...');
      
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExportResult('Successfully exported 45 drug records to Tatmeen UAE system');
      toast.success('Export to Tatmeen completed');
    } catch (error) {
      toast.error('Failed to export to Tatmeen');
    }
  };

  const handleVRSSync = async () => {
    try {
      toast.info('Syncing with VRS...');
      
      // Simulate VRS sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setExportResult('Successfully synced 23 verification requests with DSCSA VRS');
      toast.success('VRS synchronization completed');
    } catch (error) {
      toast.error('Failed to sync with VRS');
    }
  };

  const handleVerificationRequest = async () => {
    if (!sgtin.trim()) {
      toast.error('Please enter a valid SGTIN');
      return;
    }

    try {
      toast.info('Submitting verification request...');
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setExportResult(`Verification for ${sgtin}: VALID - Product authenticated through VRS`);
      toast.success('Verification completed');
    } catch (error) {
      toast.error('Verification request failed');
    }
  };

  const generateGS1XML = () => {
    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<epcis:EPCISDocument xmlns:epcis="urn:epcglobal:epcis:xsd:2">
  <EPCISBody>
    <EventList>
      <ObjectEvent>
        <eventTime>2025-06-16T10:30:00Z</eventTime>
        <epcList>
          <epc>urn:epc:id:sgtin:0614141.012345.1001</epc>
        </epcList>
        <action>OBSERVE</action>
        <bizStep>urn:epcglobal:cbv:bizstep:commissioning</bizStep>
      </ObjectEvent>
    </EventList>
  </EPCISBody>
</epcis:EPCISDocument>`;
    
    const blob = new Blob([sampleXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drug_trace_data.xml';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('GS1 XML file downloaded');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regulatory System Integration
          </CardTitle>
          <CardDescription>
            Connect ZBL with external regulatory platforms for compliance reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tatmeen" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tatmeen">UAE Tatmeen</TabsTrigger>
              <TabsTrigger value="dscsa">US DSCSA/VRS</TabsTrigger>
              <TabsTrigger value="export">Data Export</TabsTrigger>
            </TabsList>

            <TabsContent value="tatmeen" className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Tatmeen Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Export drug traceability data to UAE Tatmeen system
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={tatmeenEnabled ? "default" : "secondary"}>
                    {tatmeenEnabled ? "Connected" : "Disconnected"}
                  </Badge>
                  <Switch
                    checked={tatmeenEnabled}
                    onCheckedChange={setTatmeenEnabled}
                  />
                </div>
              </div>

              {tatmeenEnabled && (
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Connected to Tatmeen API. Ready to export GS1-compliant data.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleTatmeenExport} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Export to Tatmeen
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="dscsa" className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">DSCSA VRS Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect to Verification Router Service for drug authentication
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={vrsEnabled ? "default" : "secondary"}>
                    {vrsEnabled ? "Connected" : "Disconnected"}
                  </Badge>
                  <Switch
                    checked={vrsEnabled}
                    onCheckedChange={setVrsEnabled}
                  />
                </div>
              </div>

              {vrsEnabled && (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Connected to DSCSA VRS. Ready for verification requests.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sgtin">Product SGTIN for Verification</Label>
                      <Input
                        id="sgtin"
                        placeholder="e.g., sgtin:0614141.012345.1001"
                        value={sgtin}
                        onChange={(e) => setSgtin(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleVerificationRequest} className="flex-1">
                        <Shield className="h-4 w-4 mr-2" />
                        Submit Verification
                      </Button>
                      <Button onClick={handleVRSSync} variant="outline">
                        <Link2 className="h-4 w-4 mr-2" />
                        Sync with VRS
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option value="gs1-xml">GS1 EPCIS XML</option>
                    <option value="json">JSON Format</option>
                    <option value="csv">CSV Export</option>
                    <option value="pdf">PDF Report</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={generateGS1XML} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download GS1 XML
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Exports include complete traceability data with GS1-compliant formatting
                    for regulatory submission.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>

          {exportResult && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{exportResult}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
