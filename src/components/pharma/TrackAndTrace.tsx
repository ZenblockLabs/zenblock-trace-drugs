
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Package, Truck, Building, CheckCircle } from 'lucide-react';
import { pharmaTraceabilityService, TraceResponse } from '@/services/PharmaTraceabilityService';
import { toast } from 'sonner';

export function TrackAndTrace() {
  const [gtin, setGtin] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [traceData, setTraceData] = useState<TraceResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrace = async () => {
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
      
      setTraceData(response);
      toast.success('Product traced successfully');
    } catch (error) {
      toast.error('Failed to trace product');
      console.error('Trace error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return <Package className="h-4 w-4" />;
      case 'ship':
        return <Truck className="h-4 w-4" />;
      case 'receive':
        return <Building className="h-4 w-4" />;
      case 'dispense':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'commission':
        return 'bg-blue-500';
      case 'ship':
        return 'bg-yellow-500';
      case 'receive':
        return 'bg-green-500';
      case 'dispense':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Track & Trace</h2>
        <p className="text-muted-foreground">
          Trace the movement of pharmaceutical products through the supply chain
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Identifiers</CardTitle>
          <CardDescription>
            Enter at least one identifier to trace the product
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
          <Button onClick={handleTrace} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tracing...
              </>
            ) : (
              'Trace Product'
            )}
          </Button>
        </CardContent>
      </Card>

      {traceData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Product Name</Label>
                  <p className="text-sm text-muted-foreground">{traceData.product.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Manufacturer</Label>
                  <p className="text-sm text-muted-foreground">{traceData.product.manufacturer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">GTIN</Label>
                  <p className="text-sm text-muted-foreground">{traceData.product.gtin}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lot Number</Label>
                  <p className="text-sm text-muted-foreground">{traceData.product.lotNumber}</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="outline">
                  Permission Level: {traceData.permissionLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Timeline</CardTitle>
              <CardDescription>
                Blockchain-verified events in chronological order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {traceData.events.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`rounded-full p-2 ${getEventColor(event.type)} text-white`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{event.type}</h4>
                        <Badge variant="secondary">{event.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.organization} - {event.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.details && Object.keys(event.details).length > 0 && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {index < traceData.events.length - 1 && (
                      <div className="ml-4 mt-4 h-8 w-px bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              All events verified on Hyperledger Fabric blockchain. 
              Data integrity guaranteed through immutable ledger technology.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
