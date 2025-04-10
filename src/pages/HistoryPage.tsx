
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, Package, ArrowUp, ArrowDown, Clock, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { TrackingEvent, Drug } from "@/services/types";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { useAuth } from "@/context/AuthContext";

export function HistoryPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const drugId = searchParams.get("drugId");
  
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Determine user role based on email
    if (user?.email) {
      let role = null;
      if (user.email.includes('manufacturer')) {
        role = 'manufacturer';
      } else if (user.email.includes('distributor')) {
        role = 'distributor';
      } else if (user.email.includes('dispenser')) {
        role = 'dispenser';
      } else if (user.email.includes('regulator')) {
        role = 'regulator';
      }
      setUserRole(role);
      setIsFiltered(role !== null && role !== 'regulator');
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const service = await getBlockchainService(user?.email || null);
        
        if (drugId) {
          const drugData = await service.getDrugById(drugId);
          setDrug(drugData);
          
          if (drugData) {
            const drugEvents = await service.getEventsByDrug(drugId);
            setEvents(drugEvents);
          } else {
            setError("Drug not found with the specified ID.");
          }
        } else {
          const allEvents = await service.getAllEvents();
          setEvents(allEvents);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [drugId, user?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commission':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'qa-passed':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'ship':
        return <ArrowUp className="h-5 w-5 text-indigo-500" />;
      case 'receive':
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case 'recall':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warehouse':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'dispense':
        return <Package className="h-5 w-5 text-teal-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getEventColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commission':
        return 'bg-blue-100 text-blue-800';
      case 'qa-passed':
        return 'bg-green-100 text-green-800';
      case 'ship':
        return 'bg-indigo-100 text-indigo-800';
      case 'receive':
        return 'bg-green-100 text-green-800';
      case 'recall':
        return 'bg-red-100 text-red-800';
      case 'warehouse':
        return 'bg-purple-100 text-purple-800';
      case 'dispense':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{drug ? `History for ${drug.productName}` : 'Event History'}</h1>
          <p className="text-muted-foreground">
            {drug 
              ? `Tracking events for ${drug.sgtin} (Batch: ${drug.batchNumber})` 
              : 'All supply chain events in the blockchain'}
          </p>
        </div>
        
        {drug && (
          <Badge className="text-sm" variant="outline">
            {drug.status || 'Unknown Status'}
          </Badge>
        )}
      </div>
      
      {/* Role-based filtering notice */}
      {isFiltered && (
        <Alert variant="outline" className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            🔐 Filtered view – showing only relevant events for your role ({userRole}).
          </AlertDescription>
        </Alert>
      )}
      
      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-2 text-lg font-medium">No events found</p>
            <p className="text-sm text-muted-foreground">
              {drugId 
                ? 'This product has no recorded tracking events yet.' 
                : 'There are no tracking events in the system yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Chain of Custody Timeline</CardTitle>
            <CardDescription>
              Chronological history of this product through the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {[...events]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((event, index) => (
                  <li key={event.id} className="mb-8 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                      {getEventIcon(event.type)}
                    </span>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className={getEventColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        <time className="text-xs font-normal text-gray-500">
                          {formatDate(event.timestamp)}
                        </time>
                      </div>
                      
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">
                        {typeof event.actor === 'string' 
                          ? event.actor 
                          : `${event.actor.name} (${event.actor.role})`}
                      </h3>
                      
                      <p className="mb-2 text-gray-700">
                        <span className="font-semibold">Location:</span> {event.location || 'Unknown'}
                      </p>
                      
                      {event.details && Object.keys(event.details).length > 0 && (
                        <>
                          <Separator className="my-2" />
                          <div className="mt-2">
                            <p className="font-semibold">Additional Details:</p>
                            <ul className="mt-1 space-y-1">
                              {Object.entries(event.details).map(([key, value]) => {
                                // Skip notes as we display them separately
                                if (key === 'notes') return null;
                                
                                // Skip complex nested objects
                                if (typeof value === 'object' && value !== null) return null;
                                
                                return (
                                  <li key={key} className="text-sm text-gray-700">
                                    <span className="font-medium capitalize">{key}:</span> {String(value)}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          
                          {event.details.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <p className="text-sm">{event.details.notes}</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Display blockchain verification status */}
                      {event.details && event.details.isOnChain && (
                        <div className="mt-3 flex items-center justify-end">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Blockchain Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
