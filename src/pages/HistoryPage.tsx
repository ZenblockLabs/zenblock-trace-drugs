
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getBlockchainService } from '@/services/blockchainServiceFactory';
import { TrackingEvent } from "@/services/mockBlockchainService";
import { Search, Filter, PackageCheck, Truck, Pill, AlertTriangle, Calendar, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const HistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TrackingEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("drugId") || "");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const service = await getBlockchainService();
        const drugId = searchParams.get("drugId");
        let eventsData: TrackingEvent[] = [];
        
        if (drugId) {
          eventsData = await service.getEventsByDrug(drugId);
          setSearchQuery(drugId);
        } else {
          eventsData = await service.getAllEvents();
        }
        
        setEvents(eventsData);
        setFilteredEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [searchParams]);

  useEffect(() => {
    // Apply filters
    let results = events;
    
    // Apply search query
    if (searchQuery) {
      results = results.filter(event => event.drugId.includes(searchQuery));
    }
    
    // Apply type filter
    if (typeFilter && typeFilter !== "all") {
      results = results.filter(event => event.eventType === typeFilter);
    }
    
    setFilteredEvents(results);
  }, [searchQuery, typeFilter, events]);

  const handleSearch = () => {
    if (searchQuery) {
      setSearchParams({ drugId: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'commission':
        return <Pill className="h-5 w-5 text-blue-500" />;
      case 'ship':
        return <Truck className="h-5 w-5 text-amber-500" />;
      case 'receive':
        return <PackageCheck className="h-5 w-5 text-green-500" />;
      case 'dispense':
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case 'recall':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getEventBadge = (eventType: string) => {
    const styles = {
      'commission': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      'ship': 'bg-amber-100 text-amber-800 hover:bg-amber-100',
      'receive': 'bg-green-100 text-green-800 hover:bg-green-100',
      'dispense': 'bg-purple-100 text-purple-800 hover:bg-purple-100',
      'recall': 'bg-red-100 text-red-800 hover:bg-red-100',
    };
    
    return (
      <Badge variant="outline" className={styles[eventType] || ''}>
        {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">Loading event history...</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="relative pl-14">
                  <Skeleton className="absolute -left-14 mt-1 w-10 h-10 rounded-full" />
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">
          View and search blockchain events for all products
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific events by drug ID or event type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Drug ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="ship">Ship</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="dispense">Dispense</SelectItem>
                  <SelectItem value="recall">Recall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="w-full sm:w-auto">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredEvents.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Event Timeline</CardTitle>
            <CardDescription>
              Showing {filteredEvents.length} events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              
              <div className="space-y-8 relative pl-14">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="relative">
                    <div className={`absolute -left-14 mt-1 w-10 h-10 rounded-full border flex items-center justify-center 
                      ${event.eventType === 'recall' ? 'bg-red-50 border-red-200' : 
                       event.eventType === 'ship' ? 'bg-amber-50 border-amber-200' :
                       event.eventType === 'receive' ? 'bg-green-50 border-green-200' : 
                       event.eventType === 'dispense' ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'}`}
                    >
                      {getEventIcon(event.eventType)}
                    </div>
                    
                    <div className={`bg-background border rounded-lg p-4 
                      ${event.eventType === 'recall' ? 'border-l-4 border-l-red-500' : 
                       event.eventType === 'ship' ? 'border-l-4 border-l-amber-500' :
                       event.eventType === 'receive' ? 'border-l-4 border-l-green-500' : 
                       event.eventType === 'dispense' ? 'border-l-4 border-l-purple-500' : 
                       'border-l-4 border-l-blue-500'}`}>
                      <div className="flex justify-between items-start flex-col sm:flex-row gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">
                            {getEventBadge(event.eventType)}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            for Drug ID: {event.drugId}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Location:</p>
                              <p className="text-sm font-medium">{event.location}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-muted-foreground">Actor:</p>
                              <p className="text-sm font-medium">
                                {event.actor.name} <span className="text-xs text-muted-foreground">({event.actor.role})</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {event.details && Object.keys(event.details).length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Event Details:</p>
                            <div className="bg-muted/50 p-2 rounded-md">
                              {Object.entries(event.details).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm py-0.5">
                                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                  <span className="font-medium">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-2 text-lg font-medium">No events found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setSearchParams({});
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
