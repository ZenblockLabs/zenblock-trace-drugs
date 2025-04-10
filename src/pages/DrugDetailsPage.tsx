
import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeModal } from "@/components/QRCodeModal";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { RecallStatus } from "@/components/RecallStatus";
import { Building2, Clock, Package } from "lucide-react";

export function DrugDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No drug ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const blockchainService = await getBlockchainService();
        const drugData = await blockchainService.getDrugById(id);
        setData(drugData);
      } catch (error) {
        console.error("Error fetching drug details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-2">Drug Not Found</h2>
              <p className="text-muted-foreground mb-6">The requested drug information could not be found.</p>
              <Button asChild>
                <RouterLink to="/drugs">Back to Drugs</RouterLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{data.productName || data.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={data.status || 'manufactured'} />
            <span className="text-gray-500">Batch: {data.batchNumber}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <RouterLink to="/drugs">
              Back to Drugs
            </RouterLink>
          </Button>
          
          {/* QR Code Generator for ALL users */}
          <QRCodeModal 
            drugId={data.id} 
            sgtin={data.sgtin} 
            productName={data.productName || data.name} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            
            <Tabs defaultValue="details">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="details" className="m-0">
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 pt-4">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Product Identifiers</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">GTIN</p>
                          <p className="font-medium">{data.gtin}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">SGTIN</p>
                          <p className="font-medium">{data.sgtin}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Batch Number</p>
                          <p className="font-medium">{data.batchNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Product Description</h3>
                      <p className="text-gray-700">{data.description || `${data.productName || data.name} is used to treat various conditions including...`}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Product Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Dosage</p>
                          <p className="font-medium">{data.dosage || '50mg'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Manufacturer</p>
                          <p className="font-medium">{data.manufacturerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiry Date</p>
                          <p className="font-medium">{formatDate(data.expiryDate)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Quality Assurance</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Verified Authentic</p>
                            <p className="text-sm text-gray-500">Blockchain verified original product</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Temperature Controlled</p>
                            <p className="text-sm text-gray-500">Stored between 2-8°C during transport</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">GMP Compliant</p>
                            <p className="text-sm text-gray-500">Manufactured following Good Manufacturing Practices</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Current Owner</h3>
                    <Card className="bg-blue-50 border-blue-100">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-blue-200 p-3 rounded-full">
                          <Building2 className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <p className="font-medium text-lg">{data.currentOwnerName}</p>
                          <p className="text-blue-700">{data.currentOwnerRole || 'Distributor'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="tracking" className="m-0">
                <CardContent className="py-6">
                  <p className="text-gray-500 mb-6">Track the journey of this product through the supply chain.</p>
                  
                  <div className="flex justify-center mb-6">
                    <Button asChild>
                      <RouterLink to={`/history?drugId=${data.id}`}>
                        View Full Chain of Custody
                      </RouterLink>
                    </Button>
                  </div>
                  
                  <RecallStatus sgtin={data.sgtin} className="mt-4" />
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Information</CardTitle>
                <CardDescription>Current product status and location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Status:</p>
                    <div className="mt-1">
                      <StatusBadge size="lg" status={data.status || 'manufactured'} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Owner:</p>
                    <p className="font-medium">{data.currentOwnerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner Type:</p>
                    <p className="font-medium">{data.currentOwnerRole || 'Distributor'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated:</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Available operations for this product</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <RouterLink to={`/history?drugId=${data.id}`}>
                      <Clock className="mr-2 h-4 w-4" />
                      View Full History
                    </RouterLink>
                  </Button>
                  
                  {user?.role === 'manufacturer' && (
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="mr-2 h-4 w-4" />
                      Transfer Ownership
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
