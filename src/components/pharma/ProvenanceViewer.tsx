
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Package, Truck, Building, CheckCircle, Shield, Clock } from 'lucide-react';
import { pharmaTraceabilityService, TraceResponse } from '@/services/PharmaTraceabilityService';
import { toast } from 'sonner';

export function ProvenanceViewer() {
  const [gtin, setGtin] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [provenanceData, setProvenanceData] = useState<TraceResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadProvenance = async () => {
    if (!gtin && !lotNumber && !serialNumber) {
      toast.error('Please provide at least one identifier');
      return;
    }

    setLoading(true);
    try {
      const response = await pharmaTraceabilityService.traceProduct({
        gtin: gtin || undefined,
        lotNumber: lotNumber || undefined,
        serialNumber: serialNumber || undefined,
      });
      
      setProvenanceData(response);
      toast.success('Provenance data loaded successfully');
    } catch (error) {
      toast.error('Failed to load provenance data');
      console.error('Provenance error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return <Package className="h-6 w-6" />;
      case 'ship':
        return <Truck className="h-6 w-6" />;
      case 'receive':
        return <Building className="h-6 w-6" />;
      case 'dispense':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'commission':
        return 'border-blue-500 bg-blue-50';
      case 'ship':
        return 'border-yellow-500 bg-yellow-50';
      case 'receive':
        return 'border-green-500 bg-green-50';
      case 'dispense':
        return 'border-purple-500 bg-purple-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const TimelineView = () => {
    if (!provenanceData) return null;

    return (
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        <div className="space-y-8">
          {provenanceData.events.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-6">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">{event.type}</CardTitle>
                      <Badge variant="outline">{event.role}</Badge>
                    </div>
                    <CardDescription>
                      {event.organization} • {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {event.details && Object.keys(event.details).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Event Details</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TableView = () => {
    if (!provenanceData) return null;

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-3 text-left">Event</th>
              <th className="border border-border p-3 text-left">Organization</th>
              <th className="border border-border p-3 text-left">Location</th>
              <th className="border border-border p-3 text-left">Timestamp</th>
              <th className="border border-border p-3 text-left">Role</th>
              <th className="border border-border p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {provenanceData.events.map((event) => (
              <tr key={event.id} className="hover:bg-muted/50">
                <td className="border border-border p-3">
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.type)}
                    <span className="capitalize font-medium">{event.type}</span>
                  </div>
                </td>
                <td className="border border-border p-3">{event.organization}</td>
                <td className="border border-border p-3">{event.location}</td>
                <td className="border border-border p-3">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td className="border border-border p-3">
                  <Badge variant="outline">{event.role}</Badge>
                </td>
                <td className="border border-border p-3">
                  {event.details && Object.keys(event.details).length > 0 ? (
                    <div className="space-y-1 text-xs">
                      {Object.entries(event.details).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No details</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Provenance Viewer</h2>
        <p className="text-muted-foreground">
          Visual timeline of product events with blockchain verification
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Search</CardTitle>
          <CardDescription>
            Enter product identifiers to view blockchain-verified provenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gtin">GTIN</Label>
              <Input
                id="gtin"
                placeholder="00012345678901"
                value={gtin}
                onChange={(e) => setGtin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot">Lot Number</Label>
              <Input
                id="lot"
                placeholder="LOT001"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serial">Serial Number</Label>
              <Input
                id="serial"
                placeholder="SN123456789"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleLoadProvenance} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Provenance...
              </>
            ) : (
              'Load Provenance Data'
            )}
          </Button>
        </CardContent>
      </Card>

      {provenanceData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Blockchain Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Product</Label>
                  <p className="text-sm text-muted-foreground">{provenanceData.product.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Manufacturer</Label>
                  <p className="text-sm text-muted-foreground">{provenanceData.product.manufacturer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Permission Level</Label>
                  <Badge variant="outline">{provenanceData.permissionLevel}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="space-y-6">
              <TimelineView />
            </TabsContent>
            
            <TabsContent value="table" className="space-y-6">
              <TableView />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
