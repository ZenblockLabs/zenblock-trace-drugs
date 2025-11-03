import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Thermometer, Droplets, TrendingUp, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function ColdChainPage() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  // Fetch shipments
  const { data: shipments } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*, batches(batch_number, product_name)")
        .eq("temperature_controlled", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch cold chain events for selected shipment
  const { data: coldchainEvents } = useQuery({
    queryKey: ["coldchain-events", selectedShipment],
    queryFn: async () => {
      if (!selectedShipment) return [];
      const { data, error } = await supabase
        .from("coldchain_events")
        .select("*")
        .eq("shipment_id", selectedShipment)
        .order("recorded_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedShipment,
  });

  // Fetch temperature excursions with shipment info
  const { data: excursions } = useQuery({
    queryKey: ["temperature-excursions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coldchain_events")
        .select("*")
        .eq("excursion_flag", true)
        .order("recorded_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      
      // Fetch shipment details separately
      const enrichedData = await Promise.all(
        (data || []).map(async (event) => {
          const { data: shipment } = await supabase
            .from("shipments")
            .select("shipment_number, from_location, to_location")
            .eq("id", event.shipment_id)
            .single();
          return { ...event, shipments: shipment };
        })
      );
      
      return enrichedData;
    },
  });

  const temperatureData = coldchainEvents?.map(event => ({
    time: new Date(event.recorded_at).toLocaleTimeString(),
    min: event.temp_min,
    max: event.temp_max,
    avg: event.temp_avg,
    humidity: event.humidity,
  })) || [];

  const activeShipment = shipments?.find(s => s.id === selectedShipment);
  const hasExcursion = coldchainEvents?.some(e => e.excursion_flag);

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Cold Chain Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time temperature tracking and compliance monitoring
            </p>
          </div>
        </div>

        {excursions && excursions.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {excursions.length} temperature excursion(s) detected in recent shipments
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shipments?.filter(s => s.status === 'in_transit').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temp Excursions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {excursions?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {shipments ? Math.round(((shipments.length - (excursions?.length || 0)) / shipments.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="shipments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="monitoring">Temperature Monitoring</TabsTrigger>
            <TabsTrigger value="excursions">Excursions</TabsTrigger>
          </TabsList>

          <TabsContent value="shipments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature-Controlled Shipments</CardTitle>
                <CardDescription>Select a shipment to view temperature data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {shipments?.map((shipment) => (
                    <div
                      key={shipment.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShipment === shipment.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedShipment(shipment.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{shipment.shipment_number}</div>
                          <div className="text-sm text-muted-foreground">
                            {shipment.batches?.product_name} - {shipment.batches?.batch_number}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {shipment.from_location} → {shipment.to_location}
                          </div>
                        </div>
                        <Badge variant={shipment.status === 'in_transit' ? 'default' : 'secondary'}>
                          {shipment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            {selectedShipment && activeShipment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Monitoring - {activeShipment.shipment_number}</CardTitle>
                  <CardDescription>
                    {activeShipment.from_location} → {activeShipment.to_location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasExcursion && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Temperature excursion detected during this shipment
                      </AlertDescription>
                    </Alert>
                  )}

                  {temperatureData.length > 0 ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Temperature Range (°C)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={temperatureData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 12]} />
                            <Tooltip />
                            <Area type="monotone" dataKey="max" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                            <Area type="monotone" dataKey="avg" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                            <Area type="monotone" dataKey="min" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {temperatureData.some(d => d.humidity) && (
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Droplets className="h-4 w-4" />
                            Humidity (%)
                          </h3>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={temperatureData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="humidity" stroke="#8b5cf6" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No temperature data recorded yet
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-muted-foreground text-center">
                    Select a shipment to view temperature monitoring data
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="excursions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Excursions</CardTitle>
                <CardDescription>Recent violations of cold chain requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {excursions?.map((excursion) => (
                    <div key={excursion.id} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                          <div>
                            <div className="font-semibold">{excursion.shipments?.shipment_number}</div>
                            <div className="text-sm text-muted-foreground">
                              {excursion.shipments?.from_location} → {excursion.shipments?.to_location}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(excursion.recorded_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Temperature:</span> {excursion.temp_min}°C - {excursion.temp_max}°C
                      </div>
                      {excursion.excursion_details && (
                        <div className="text-sm text-destructive mt-1">
                          {excursion.excursion_details}
                        </div>
                      )}
                    </div>
                  ))}
                  {!excursions || excursions.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No temperature excursions detected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
