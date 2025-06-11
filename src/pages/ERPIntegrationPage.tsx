
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { erpBlockchainIntegration } from '@/services/integration/ERPBlockchainIntegration';
import { ERPOrder, ERPInventoryItem } from '@/services/erp/ERPService';
import { Package, ShoppingCart, Warehouse, Activity, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ERPIntegrationPage = () => {
  const [orders, setOrders] = useState<ERPOrder[]>([]);
  const [inventory, setInventory] = useState<ERPInventoryItem[]>([]);
  const [events, setEvents] = useState(erpBlockchainIntegration.getIntegrationEvents());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [erpOrders, erpInventory] = await Promise.all([
        erpBlockchainIntegration.getERPOrders(),
        // Mock inventory call - in real implementation this would be from ERP service
        Promise.resolve([
          {
            drugId: 'drug-001',
            drugName: 'Aspirin 100mg',
            batchId: 'BATCH-ASP-2024-001',
            quantity: 5000,
            location: 'Warehouse A - Section 1',
            expiryDate: '2026-12-31',
            cost: 0.10
          },
          {
            drugId: 'drug-002', 
            drugName: 'Ibuprofen 200mg',
            batchId: 'BATCH-IBU-2024-001',
            quantity: 3000,
            location: 'Warehouse A - Section 2',
            expiryDate: '2025-08-15',
            cost: 0.18
          }
        ] as ERPInventoryItem[])
      ]);

      setOrders(erpOrders);
      setInventory(erpInventory);
      setEvents(erpBlockchainIntegration.getIntegrationEvents());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ERP data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const syncOrderToBlockchain = async (orderId: string) => {
    try {
      await erpBlockchainIntegration.syncOrderToBlockchain(orderId);
      setEvents(erpBlockchainIntegration.getIntegrationEvents());
      toast({
        title: "Success",
        description: `Order ${orderId} synced to blockchain`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync order to blockchain",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary", 
      shipped: "default",
      delivered: "default"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ERP Integration</h1>
          <p className="text-muted-foreground">
            Manage pharmaceutical ERP system integration and blockchain synchronization
          </p>
        </div>
        <Button onClick={loadData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integration Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="events">Integration Events</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>ERP Orders</CardTitle>
              <CardDescription>Manage and sync orders from the ERP system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>${order.totalAmount}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncOrderToBlockchain(order.id)}
                        >
                          Sync to Blockchain
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Current stock levels from ERP system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={`${item.drugId}-${item.batchId}`}>
                      <TableCell className="font-medium">{item.drugName}</TableCell>
                      <TableCell>{item.batchId}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>${item.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Integration Events</CardTitle>
              <CardDescription>Recent ERP-Blockchain synchronization events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(-10).reverse().map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-xs">{event.id}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.source}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
