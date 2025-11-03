import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBlockchainService, isUsingMockService } from '@/services/blockchainServiceFactory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockchainConfig } from '@/components/BlockchainConfig';
import { Activity, DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { usePageAccessLog } from '@/components/SecurityAudit';

export const DashboardPage = () => {
  const [usingMock, setUsingMock] = useState(false);
  
  // Log page access for security audit
  usePageAccessLog('dashboard');
  
  // Get blockchain service status
  useEffect(() => {
    const checkService = async () => {
      const using = await isUsingMockService();
      setUsingMock(using);
    };
    
    checkService();
  }, []);

  // Fetch drugs count
  const { data: drugsCount = 0 } = useQuery({
    queryKey: ['dashboard-drugs-count'],
    queryFn: async () => {
      const service = await getBlockchainService();
      const drugs = await service.getAllDrugs();
      return drugs.length;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  
  // Fetch recent events
  const { data: recentEvents = [] } = useQuery({
    queryKey: ['dashboard-recent-events'],
    queryFn: async () => {
      const service = await getBlockchainService();
      return service.getRecentEvents(5);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-sm sm:text-base">Total Drugs</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Registered in the system</CardDescription>
            </div>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{drugsCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-sm sm:text-base">Recent Events</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Last 24 hours</CardDescription>
            </div>
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{recentEvents.length}</div>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-sm sm:text-base">Compliance Score</CardTitle>
              <CardDescription className="text-xs sm:text-sm">DSCSA compliance</CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">98%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BlockchainConfig />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest events in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-2 pb-2 border-b last:border-0">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">{event.type} event</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new Date(event.timestamp).toLocaleString()} by {typeof event.actor === 'string' ? event.actor : event.actor.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No recent events found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {usingMock && (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-md flex gap-2 sm:gap-3">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800 text-sm sm:text-base">Demo Mode Active</h3>
            <p className="text-xs sm:text-sm text-yellow-700 mt-1">
              This application is currently running with mock blockchain data. In a production environment, 
              it would connect to a real Hyperledger Fabric network to ensure full security and integrity
              of the pharmaceutical supply chain.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
