
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrackingEvent, mockBlockchainService } from "@/services/mockBlockchainService";
import { Search, Filter, PackageCheck, Truck, Pill, AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        const drugId = searchParams.get("drugId");
        let eventsData: TrackingEvent[] = [];
        
        if (drugId) {
          eventsData = await mockBlockchainService.getEventsByDrug(drugId);
          setSearchQuery(drugId);
        } else {
          eventsData = await mockBlockchainService.getAllEvents();
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
        return <Pill className="h-5 w-5 text-purple-500" />;
      case 'recall':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading event history...</div>;
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
                    <div className="absolute -left-14 mt-1 w-10 h-10 rounded-full bg-background border flex items-center justify-center">
                      {getEventIcon(event.eventType)}
                    </div>
                    
                    <div className="bg-background border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium capitalize text-lg">
                          {event.eventType} Event
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Drug ID:</p>
                              <p className="text-sm font-medium">{event.drugId}</p>
                            </div>
                            
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
