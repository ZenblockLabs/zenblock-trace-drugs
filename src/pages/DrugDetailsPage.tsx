
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { Drug, TrackingEvent, mockBlockchainService } from "@/services/mockBlockchainService";
import { Pill, Clock, FileText, Truck, PackageCheck, ArrowLeft, Building, Thermometer, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export const DrugDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [drug, setDrug] = useState<Drug | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDrugDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const drugData = await mockBlockchainService.getDrugById(id);
        setDrug(drugData);
        
        if (drugData) {
          const eventsData = await mockBlockchainService.getEventsByDrug(drugData.id);
          setEvents(eventsData);
        }
      } catch (error) {
        console.error("Error fetching drug details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDrugDetails();
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading drug details...</div>;
  }

  if (!drug) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-4">Drug not found</h2>
        <p className="text-muted-foreground mb-6">
          The drug you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link to="/drugs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-2"
          >
            <Link to="/drugs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{drug.productName}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={drug.status} />
            <p className="text-sm text-muted-foreground">
              Batch: {drug.batchNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <Tabs defaultValue="details">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <TabsContent value="details">
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Product Identifiers</h3>
                        <div className="mt-1 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">GTIN:</span>
                            <span className="text-sm font-medium">{drug.gtin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">SGTIN:</span>
                            <span className="text-sm font-medium">{drug.sgtin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Batch Number:</span>
                            <span className="text-sm font-medium">{drug.batchNumber}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Product Details</h3>
                        <div className="mt-1 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Dosage:</span>
                            <span className="text-sm font-medium">{drug.dosage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Manufacturer:</span>
                            <span className="text-sm font-medium">{drug.manufacturerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Expiry Date:</span>
                            <span className="text-sm font-medium">{drug.expiryDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Owner</h3>
                      <Card className="bg-accent/50">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Building className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{drug.currentOwnerName}</p>
                              <p className="text-sm text-muted-foreground capitalize">{drug.currentOwnerRole}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Product Description</h3>
                      <p className="mt-1 text-sm">
                        {drug.description || 'No description available for this product.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Quality Assurance</h3>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-1.5 rounded-full">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Verified Authentic</p>
                            <p className="text-xs text-muted-foreground">
                              Blockchain verified original product
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-1.5 rounded-full">
                            <Thermometer className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Temperature Controlled</p>
                            <p className="text-xs text-muted-foreground">
                              Stored between 2-8°C during transport
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 p-1.5 rounded-full">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">GMP Compliant</p>
                            <p className="text-xs text-muted-foreground">
                              Manufactured following Good Manufacturing Practices
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="tracking">
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  
                  <div className="space-y-8 relative pl-10">
                    {events.length > 0 ? (
                      events.map((event, index) => (
                        <div key={event.id} className="relative">
                          <div className="absolute -left-10 mt-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            {event.eventType === 'commission' && <Pill className="h-3 w-3 text-white" />}
                            {event.eventType === 'ship' && <Truck className="h-3 w-3 text-white" />}
                            {event.eventType === 'receive' && <PackageCheck className="h-3 w-3 text-white" />}
                            {(event.eventType !== 'commission' && event.eventType !== 'ship' && event.eventType !== 'receive') && <Clock className="h-3 w-3 text-white" />}
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium capitalize">
                                {event.eventType} Event
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                            
                            <p className="text-sm mt-1">
                              {event.eventType === 'commission' && `Product commissioned by ${event.actor.name}`}
                              {event.eventType === 'ship' && `Shipped by ${event.actor.name} to ${event.details.destination || 'next owner'}`}
                              {event.eventType === 'receive' && `Received by ${event.actor.name}`}
                              {event.eventType === 'dispense' && `Dispensed by ${event.actor.name}`}
                              {event.eventType === 'recall' && `Recalled by ${event.actor.name}`}
                            </p>
                            
                            <div className="mt-2 text-sm">
                              <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground">Location: {event.location}</span>
                                <span className="text-muted-foreground">Actor: {event.actor.name} ({event.actor.role})</span>
                                
                                {/* Event details when available */}
                                {event.details && Object.keys(event.details).length > 0 && (
                                  <div className="mt-1 p-2 bg-muted/50 rounded-md">
                                    <h4 className="text-xs font-medium mb-1">Additional Details:</h4>
                                    {Object.entries(event.details).map(([key, value]) => (
                                      <div key={key} className="text-xs flex justify-between">
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                        <span>{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4">
                        <p>No tracking events found for this drug.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Information</CardTitle>
              <CardDescription>Current product status and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Status:</span>
                  <StatusBadge status={drug.status} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Owner:</span>
                  <span className="text-sm font-medium">{drug.currentOwnerName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Owner Type:</span>
                  <span className="text-sm font-medium capitalize">{drug.currentOwnerRole}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Updated:</span>
                  <span className="text-sm font-medium">
                    {events.length > 0 
                      ? format(new Date(events[events.length - 1].timestamp), 'MMM d, yyyy')
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions Card - shown based on user role and drug status */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Available operations for this product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Manufacturer Actions */}
                {user.role === 'manufacturer' && drug.currentOwnerId === user.id && (
                  <Button className="w-full">
                    <Truck className="mr-2 h-4 w-4" />
                    Ship Product
                  </Button>
                )}
                
                {/* Distributor Actions */}
                {user.role === 'distributor' && (
                  <>
                    {drug.status === 'in-transit' && drug.currentOwnerId === user.id && (
                      <Button className="w-full">
                        <PackageCheck className="mr-2 h-4 w-4" />
                        Receive Shipment
                      </Button>
                    )}
                    {drug.status === 'received' && drug.currentOwnerId === user.id && (
                      <Button className="w-full">
                        <Truck className="mr-2 h-4 w-4" />
                        Ship to Dispenser
                      </Button>
                    )}
                  </>
                )}
                
                {/* Dispenser Actions */}
                {user.role === 'dispenser' && (
                  <>
                    {drug.status === 'in-transit' && drug.currentOwnerId === user.id && (
                      <Button className="w-full">
                        <PackageCheck className="mr-2 h-4 w-4" />
                        Receive Shipment
                      </Button>
                    )}
                    {drug.status === 'received' && drug.currentOwnerId === user.id && (
                      <Button className="w-full">
                        <Pill className="mr-2 h-4 w-4" />
                        Dispense Medication
                      </Button>
                    )}
                  </>
                )}
                
                {/* Regulator Actions */}
                {user.role === 'regulator' && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    disabled={drug.status === 'recalled'}
                  >
                    Issue Recall
                  </Button>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to={`/history?drugId=${drug.id}`}>
                    <Clock className="mr-2 h-4 w-4" />
                    View Full History
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
