import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBlockchainService, Drug, TrackingEvent } from "@/services/mockBlockchainService";
import { StatusBadge } from "@/components/StatusBadge";
import { DrugCard } from "@/components/DrugCard";
import { Package, Truck, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [recentEvents, setRecentEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let drugData: Drug[] = [];
        
        if (user?.role === 'regulator') {
          // Regulators see all drugs
          drugData = await mockBlockchainService.getAllDrugs();
        } else if (user?.id) {
          // Other roles see drugs they own
          drugData = await mockBlockchainService.getDrugsByOwner(user.id);
        }
        
        setDrugs(drugData);
        
        // Get recent events
        const events = await mockBlockchainService.getRecentEvents(5);
        setRecentEvents(events);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Calculate statistics based on user role
  const calculateStats = () => {
    if (!drugs.length) return { total: 0, shipped: 0, received: 0, expired: 0 };
    
    const today = new Date();
    const expired = drugs.filter(d => new Date(d.expiryDate) < today).length;
    const shipped = drugs.filter(d => d.status === 'shipped' || d.status === 'in-transit').length;
    const received = drugs.filter(d => d.status === 'received').length;
    
    return {
      total: drugs.length,
      shipped,
      received,
      expired
    };
  };
  
  const stats = calculateStats();

  const formatEventTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'commission':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'ship':
        return <Truck className="h-4 w-4 text-amber-500" />;
      case 'receive':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'dispense':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'recall':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's the latest from your supply chain.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Items in your inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shipped}</div>
            <p className="text-xs text-muted-foreground">
              Products in transit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.received}</div>
            <p className="text-xs text-muted-foreground">
              Products received
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">
              Products expired or expiring soon
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Products */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Products</CardTitle>
              <Link 
                to="/drugs" 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View All 
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <CardDescription>
              Your latest product inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {drugs.length > 0 ? (
              <div className="space-y-4">
                {drugs.slice(0, 3).map((drug) => (
                  <div key={drug.id} className="flex items-center space-x-4 border-b pb-3">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{drug.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Batch: {drug.batchNumber}
                      </p>
                    </div>
                    <StatusBadge status={drug.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No products in your inventory
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Events</CardTitle>
              <Link 
                to="/history" 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View All 
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <CardDescription>
              Latest activity in your supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 border-b pb-3">
                    <div className="mt-0.5">
                      {getEventIcon(event.eventType)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium leading-none capitalize">
                          {event.eventType} Event
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatEventTime(event.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By: {event.actor.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent events found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Products */}
      {drugs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drugs.slice(0, 3).map((drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
