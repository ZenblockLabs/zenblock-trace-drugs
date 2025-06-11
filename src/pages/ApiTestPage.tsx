
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDrugApi } from '@/hooks/useDrugApi';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ApiTestPage() {
  const { user } = useAuth();
  const { loading, registerDrug, shipDrug, receiveDrug, dispenseDrug, getDrugHistory, getComplianceStatus } = useDrugApi();
  
  const [results, setResults] = useState<any>(null);

  // Form states
  const [drugForm, setDrugForm] = useState({
    drugName: 'Amoxicillin 500mg',
    batchId: 'BATCH-' + Date.now(),
    manufacturerName: 'ZenPharma Inc.',
    manufacturerId: 'MFG-001',
    manufacturingDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dosage: '500mg',
    description: 'Antibiotic medication',
    gtin: '01234567890123',
    serialNumbers: ['SN001', 'SN002', 'SN003']
  });

  const [shipForm, setShipForm] = useState({
    batchId: '',
    fromActorId: 'MFG-001',
    fromActorName: 'ZenPharma Inc.',
    fromRole: 'manufacturer',
    toActorId: 'DIST-001',
    toActorName: 'MediDistribute LLC',
    toRole: 'distributor',
    location: 'Boston, MA',
    timestamp: new Date().toISOString(),
    notes: 'Temperature controlled shipment'
  });

  const [receiveForm, setReceiveForm] = useState({
    batchId: '',
    receiverActorId: 'DIST-001',
    receiverActorName: 'MediDistribute LLC',
    receiverRole: 'distributor',
    location: 'Chicago, IL',
    timestamp: new Date().toISOString(),
    notes: 'Package received in good condition'
  });

  const [dispenseForm, setDispenseForm] = useState({
    batchId: '',
    dispenserActorId: 'PHARM-001',
    dispenserActorName: 'ZenMed Pharmacy',
    patientId: 'PAT-001',
    location: 'Denver, CO',
    timestamp: new Date().toISOString(),
    prescriptionId: 'RX-001',
    notes: 'Patient counseled on usage'
  });

  const [queryForm, setQueryForm] = useState({
    batchId: ''
  });

  const handleRegisterDrug = async () => {
    try {
      const result = await registerDrug(drugForm);
      setResults(result);
      setShipForm(prev => ({ ...prev, batchId: drugForm.batchId }));
      setReceiveForm(prev => ({ ...prev, batchId: drugForm.batchId }));
      setDispenseForm(prev => ({ ...prev, batchId: drugForm.batchId }));
      setQueryForm(prev => ({ ...prev, batchId: drugForm.batchId }));
    } catch (error) {
      console.error('Error registering drug:', error);
    }
  };

  const handleShipDrug = async () => {
    try {
      const result = await shipDrug(shipForm);
      setResults(result);
    } catch (error) {
      console.error('Error shipping drug:', error);
    }
  };

  const handleReceiveDrug = async () => {
    try {
      const result = await receiveDrug(receiveForm);
      setResults(result);
    } catch (error) {
      console.error('Error receiving drug:', error);
    }
  };

  const handleDispenseDrug = async () => {
    try {
      const result = await dispenseDrug(dispenseForm);
      setResults(result);
    } catch (error) {
      console.error('Error dispensing drug:', error);
    }
  };

  const handleGetHistory = async () => {
    try {
      const result = await getDrugHistory(queryForm.batchId);
      setResults(result);
    } catch (error) {
      console.error('Error getting drug history:', error);
    }
  };

  const handleGetCompliance = async () => {
    try {
      const result = await getComplianceStatus(queryForm.batchId);
      setResults(result);
    } catch (error) {
      console.error('Error getting compliance status:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to test the API endpoints.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Drug API Test Interface</CardTitle>
          <CardDescription>
            Test the comprehensive drug lifecycle API endpoints. Current role: {user.role}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="ship">Ship</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="dispense">Dispense</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register Drug Batch</CardTitle>
              <CardDescription>Manufacturer only - Register a new drug batch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="drugName">Drug Name</Label>
                  <Input
                    id="drugName"
                    value={drugForm.drugName}
                    onChange={(e) => setDrugForm(prev => ({ ...prev, drugName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input
                    id="batchId"
                    value={drugForm.batchId}
                    onChange={(e) => setDrugForm(prev => ({ ...prev, batchId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturerName">Manufacturer Name</Label>
                  <Input
                    id="manufacturerName"
                    value={drugForm.manufacturerName}
                    onChange={(e) => setDrugForm(prev => ({ ...prev, manufacturerName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={drugForm.dosage}
                    onChange={(e) => setDrugForm(prev => ({ ...prev, dosage: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                  <Input
                    id="manufacturingDate"
                    type="date"
                    value={drugForm.manufacturingDate}
                    onChange={(e) => setDrugForm(prev => ({ ...prev, manufacturingDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={drugForm.expiryDate}
                    onChange={(e) => setDrugForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleRegisterDrug} disabled={loading || user.role !== 'manufacturer'}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Drug
              </Button>
              {user.role !== 'manufacturer' && (
                <p className="text-sm text-red-600">Only manufacturers can register drugs</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ship">
          <Card>
            <CardHeader>
              <CardTitle>Ship Drug Batch</CardTitle>
              <CardDescription>Manufacturer/Distributor - Record drug shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shipBatchId">Batch ID</Label>
                  <Input
                    id="shipBatchId"
                    value={shipForm.batchId}
                    onChange={(e) => setShipForm(prev => ({ ...prev, batchId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="toActorName">To Actor Name</Label>
                  <Input
                    id="toActorName"
                    value={shipForm.toActorName}
                    onChange={(e) => setShipForm(prev => ({ ...prev, toActorName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={shipForm.location}
                    onChange={(e) => setShipForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={shipForm.notes}
                    onChange={(e) => setShipForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleShipDrug} disabled={loading || (user.role !== 'manufacturer' && user.role !== 'distributor')}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ship Drug
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive">
          <Card>
            <CardHeader>
              <CardTitle>Receive Drug Batch</CardTitle>
              <CardDescription>Distributor/Dispenser - Record drug receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiveBatchId">Batch ID</Label>
                  <Input
                    id="receiveBatchId"
                    value={receiveForm.batchId}
                    onChange={(e) => setReceiveForm(prev => ({ ...prev, batchId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="receiveLocation">Location</Label>
                  <Input
                    id="receiveLocation"
                    value={receiveForm.location}
                    onChange={(e) => setReceiveForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleReceiveDrug} disabled={loading || (user.role !== 'distributor' && user.role !== 'dispenser')}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Receive Drug
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispense">
          <Card>
            <CardHeader>
              <CardTitle>Dispense Drug</CardTitle>
              <CardDescription>Dispenser only - Record drug dispensing to patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dispenseBatchId">Batch ID</Label>
                  <Input
                    id="dispenseBatchId"
                    value={dispenseForm.batchId}
                    onChange={(e) => setDispenseForm(prev => ({ ...prev, batchId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    value={dispenseForm.patientId}
                    onChange={(e) => setDispenseForm(prev => ({ ...prev, patientId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="prescriptionId">Prescription ID</Label>
                  <Input
                    id="prescriptionId"
                    value={dispenseForm.prescriptionId}
                    onChange={(e) => setDispenseForm(prev => ({ ...prev, prescriptionId: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleDispenseDrug} disabled={loading || user.role !== 'dispenser'}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Dispense Drug
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Get Drug History</CardTitle>
              <CardDescription>Regulator only - View complete drug history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="historyBatchId">Batch ID</Label>
                <Input
                  id="historyBatchId"
                  value={queryForm.batchId}
                  onChange={(e) => setQueryForm(prev => ({ ...prev, batchId: e.target.value }))}
                />
              </div>
              <Button onClick={handleGetHistory} disabled={loading || user.role !== 'regulator'}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get History
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Check Compliance Status</CardTitle>
              <CardDescription>Regulator only - Check drug compliance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="complianceBatchId">Batch ID</Label>
                <Input
                  id="complianceBatchId"
                  value={queryForm.batchId}
                  onChange={(e) => setQueryForm(prev => ({ ...prev, batchId: e.target.value }))}
                />
              </div>
              <Button onClick={handleGetCompliance} disabled={loading || user.role !== 'regulator'}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Compliance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
