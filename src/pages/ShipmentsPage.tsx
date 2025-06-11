
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, MapPin, Clock, Plus, Eye } from "lucide-react";

interface Shipment {
  id: string;
  drugs: string[];
  fromName: string;
  toName: string;
  status: 'created' | 'in-transit' | 'delivered' | 'delayed';
  createdAt: string;
  estimatedDelivery: string;
  location?: string;
  temperature?: number;
  humidity?: number;
}

export const ShipmentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Mock shipments data
  const mockShipments: Shipment[] = [
    {
      id: "S-001",
      drugs: ["D-101", "D-102", "D-103"],
      fromName: "Medico Pharmaceuticals",
      toName: "Lifeline Distributors",
      status: "in-transit",
      createdAt: "2024-01-15T10:30:00Z",
      estimatedDelivery: "2024-01-16T14:00:00Z",
      location: "Highway 101, Mile 45",
      temperature: 4.2,
      humidity: 65
    },
    {
      id: "S-002",
      drugs: ["D-104", "D-105"],
      fromName: "Lifeline Distributors",
      toName: "City Pharmacy",
      status: "delivered",
      createdAt: "2024-01-14T08:15:00Z",
      estimatedDelivery: "2024-01-15T12:00:00Z",
      location: "City Pharmacy - Received",
      temperature: 3.8,
      humidity: 62
    },
    {
      id: "S-003",
      drugs: ["D-106"],
      fromName: "Medico Pharmaceuticals",
      toName: "Regional Hospital",
      status: "delayed",
      createdAt: "2024-01-13T16:45:00Z",
      estimatedDelivery: "2024-01-14T10:00:00Z",
      location: "Warehouse B - Customs",
      temperature: 5.1,
      humidity: 68
    }
  ];

  useEffect(() => {
    const loadShipments = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from blockchain/ERP
        setShipments(mockShipments);
      } catch (error) {
        console.error("Failed to load shipments:", error);
        toast({
          title: "Error",
          description: "Failed to load shipments",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadShipments();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateShipment = async (formData: FormData) => {
    try {
      const newShipment: Shipment = {
        id: `S-${Date.now()}`,
        drugs: (formData.get('drugs') as string).split(',').map(d => d.trim()),
        fromName: formData.get('fromName') as string,
        toName: formData.get('toName') as string,
        status: 'created',
        createdAt: new Date().toISOString(),
        estimatedDelivery: formData.get('estimatedDelivery') as string,
      };

      setShipments(prev => [newShipment, ...prev]);
      setCreateDialogOpen(false);
      
      toast({
        title: "Shipment Created",
        description: `Shipment ${newShipment.id} has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shipment",
        variant: "destructive"
      });
    }
  };

  const handleConfirmReceipt = async (shipmentId: string) => {
    try {
      setShipments(prev => prev.map(s => 
        s.id === shipmentId 
          ? { ...s, status: 'delivered' as const, location: 'Delivered' }
          : s
      ));
      
      toast({
        title: "Receipt Confirmed",
        description: `Shipment ${shipmentId} has been marked as delivered`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm receipt",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading shipments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shipments</h1>
          <p className="text-muted-foreground">Manage pharmaceutical shipments and logistics</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Shipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>
                Create a new shipment to track pharmaceutical products
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateShipment(new FormData(e.target as HTMLFormElement));
            }} className="space-y-4">
              <div>
                <Label htmlFor="drugs">Drug IDs (comma-separated)</Label>
                <Input id="drugs" name="drugs" placeholder="D-101, D-102" required />
              </div>
              <div>
                <Label htmlFor="fromName">From</Label>
                <Input id="fromName" name="fromName" placeholder="Sender name" required />
              </div>
              <div>
                <Label htmlFor="toName">To</Label>
                <Input id="toName" name="toName" placeholder="Receiver name" required />
              </div>
              <div>
                <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                <Input id="estimatedDelivery" name="estimatedDelivery" type="datetime-local" required />
              </div>
              <Button type="submit" className="w-full">Create Shipment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="all">All Shipments</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {shipments.filter(s => ['created', 'in-transit', 'delayed'].includes(s.status)).map((shipment) => (
            <Card key={shipment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{shipment.id}</CardTitle>
                    <CardDescription>
                      {shipment.fromName} → {shipment.toName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{shipment.drugs.length} drugs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{shipment.location || 'Location unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      ETA: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {shipment.temperature && (
                  <div className="flex gap-4 text-sm">
                    <span>Temp: {shipment.temperature}°C</span>
                    <span>Humidity: {shipment.humidity}%</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedShipment(shipment)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {shipment.status === 'in-transit' && (
                    <Button size="sm" onClick={() => handleConfirmReceipt(shipment.id)}>
                      <Truck className="h-4 w-4 mr-2" />
                      Confirm Receipt
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {shipments.filter(s => s.status === 'delivered').map((shipment) => (
            <Card key={shipment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{shipment.id}</CardTitle>
                    <CardDescription>
                      {shipment.fromName} → {shipment.toName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    DELIVERED
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{shipment.drugs.length} drugs delivered on {new Date(shipment.estimatedDelivery).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {shipments.map((shipment) => (
            <Card key={shipment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{shipment.id}</CardTitle>
                    <CardDescription>
                      {shipment.fromName} → {shipment.toName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{shipment.drugs.length} drugs</span>
                  <span>•</span>
                  <span>Created {new Date(shipment.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Shipment Details Dialog */}
      {selectedShipment && (
        <Dialog open={!!selectedShipment} onOpenChange={() => setSelectedShipment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Shipment Details - {selectedShipment.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <p className="font-medium">{selectedShipment.fromName}</p>
                </div>
                <div>
                  <Label>To</Label>
                  <p className="font-medium">{selectedShipment.toName}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedShipment.status)}>
                    {selectedShipment.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Current Location</Label>
                  <p className="font-medium">{selectedShipment.location || 'Unknown'}</p>
                </div>
              </div>
              
              <div>
                <Label>Drugs in Shipment</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedShipment.drugs.map(drugId => (
                    <Badge key={drugId} variant="outline">{drugId}</Badge>
                  ))}
                </div>
              </div>

              {selectedShipment.temperature && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Temperature</Label>
                    <p className="font-medium">{selectedShipment.temperature}°C</p>
                  </div>
                  <div>
                    <Label>Humidity</Label>
                    <p className="font-medium">{selectedShipment.humidity}%</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
