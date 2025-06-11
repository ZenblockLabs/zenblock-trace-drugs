
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlockchainService, getBlockchainConfig } from "@/services/blockchainServiceFactory";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Database, 
  Network, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Server,
  Clock,
  Hash,
  Layers
} from "lucide-react";

interface NetworkStatus {
  peers: PeerStatus[];
  orderers: OrdererStatus[];
  channels: ChannelInfo[];
  chaincode: ChaincodeInfo[];
  transactions: TransactionSummary;
}

interface PeerStatus {
  name: string;
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  lastSeen: string;
}

interface OrdererStatus {
  name: string;
  status: 'online' | 'offline';
  lastBlock: number;
}

interface ChannelInfo {
  name: string;
  blockHeight: number;
  peers: number;
  lastUpdate: string;
}

interface ChaincodeInfo {
  name: string;
  version: string;
  channel: string;
  status: 'active' | 'inactive';
}

interface TransactionSummary {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  lastTx: string;
}

export const BlockchainStatusPage = () => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  // Mock network status data
  const mockNetworkStatus: NetworkStatus = {
    peers: [
      { name: "peer0.org1.pharma.com", status: "online", blockHeight: 2456, lastSeen: "2024-01-15T10:30:00Z" },
      { name: "peer1.org1.pharma.com", status: "online", blockHeight: 2456, lastSeen: "2024-01-15T10:29:45Z" },
      { name: "peer0.org2.pharma.com", status: "syncing", blockHeight: 2455, lastSeen: "2024-01-15T10:28:30Z" },
    ],
    orderers: [
      { name: "orderer.pharma.com", status: "online", lastBlock: 2456 },
      { name: "orderer2.pharma.com", status: "online", lastBlock: 2456 },
    ],
    channels: [
      { name: "pharma-channel", blockHeight: 2456, peers: 3, lastUpdate: "2024-01-15T10:30:00Z" },
      { name: "compliance-channel", blockHeight: 1823, peers: 2, lastUpdate: "2024-01-15T10:25:15Z" },
    ],
    chaincode: [
      { name: "drug-traceability", version: "1.2.0", channel: "pharma-channel", status: "active" },
      { name: "compliance-contract", version: "1.0.3", channel: "compliance-channel", status: "active" },
    ],
    transactions: {
      total: 15420,
      successful: 15385,
      failed: 35,
      pending: 2,
      lastTx: "tx_abc123def456"
    }
  };

  // Query blockchain service status
  const { data: serviceStatus, refetch: refetchServiceStatus } = useQuery({
    queryKey: ['blockchain-service-status'],
    queryFn: async () => {
      try {
        const service = await getBlockchainService();
        const config = getBlockchainConfig();
        return {
          connected: true,
          mode: config.useFabric ? 'fabric' : 'mock',
          service: service.constructor.name
        };
      } catch (error) {
        return {
          connected: false,
          mode: 'unknown',
          error: error.message
        };
      }
    },
    refetchInterval: 30000,
  });

  // Query Fabric network ping
  const { data: fabricPing, refetch: refetchFabricPing } = useQuery({
    queryKey: ['fabric-ping'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fabric-ping', {
          body: { action: 'ping' }
        });
        
        if (error) throw error;
        return { status: 'connected', response: data };
      } catch (err) {
        return { status: 'disconnected', error: err.message };
      }
    },
    refetchInterval: 60000,
  });

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchServiceStatus(),
        refetchFabricPing()
      ]);
      toast({
        title: "Status Refreshed",
        description: "All network status data has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh network status",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'offline':
      case 'inactive':
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
      case 'inactive':
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Status</h1>
          <p className="text-muted-foreground">Monitor Hyperledger Fabric network health and performance</p>
        </div>
        
        <Button onClick={handleRefreshAll} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Status</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(serviceStatus?.connected ? 'connected' : 'disconnected')}
              <div className="text-2xl font-bold">
                {serviceStatus?.connected ? 'Online' : 'Offline'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Mode: {serviceStatus?.mode || 'Unknown'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Peers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockNetworkStatus.peers.filter(p => p.status === 'online').length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {mockNetworkStatus.peers.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Block Height</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...mockNetworkStatus.peers.map(p => p.blockHeight))}
            </div>
            <p className="text-xs text-muted-foreground">
              Latest block
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockNetworkStatus.transactions.successful}
            </div>
            <p className="text-xs text-muted-foreground">
              {((mockNetworkStatus.transactions.successful / mockNetworkStatus.transactions.total) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="peers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="peers">Peers</TabsTrigger>
          <TabsTrigger value="orderers">Orderers</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="chaincode">Chaincode</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="peers">
          <Card>
            <CardHeader>
              <CardTitle>Peer Nodes</CardTitle>
              <CardDescription>Status of all peer nodes in the network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNetworkStatus.peers.map((peer) => (
                  <div key={peer.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(peer.status)}
                      <div>
                        <p className="font-medium">{peer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Block Height: {peer.blockHeight}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadgeColor(peer.status)}>
                        {peer.status.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last seen: {new Date(peer.lastSeen).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orderers">
          <Card>
            <CardHeader>
              <CardTitle>Orderer Nodes</CardTitle>
              <CardDescription>Status of ordering service nodes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNetworkStatus.orderers.map((orderer) => (
                  <div key={orderer.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(orderer.status)}
                      <div>
                        <p className="font-medium">{orderer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last Block: {orderer.lastBlock}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusBadgeColor(orderer.status)}>
                      {orderer.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Channels</CardTitle>
              <CardDescription>Network channels and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNetworkStatus.channels.map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{channel.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {channel.peers} peers • Block height: {channel.blockHeight}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated: {new Date(channel.lastUpdate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chaincode">
          <Card>
            <CardHeader>
              <CardTitle>Deployed Chaincode</CardTitle>
              <CardDescription>Smart contracts deployed on the network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNetworkStatus.chaincode.map((cc) => (
                  <div key={`${cc.name}-${cc.channel}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(cc.status)}
                      <div>
                        <p className="font-medium">{cc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Version: {cc.version} • Channel: {cc.channel}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusBadgeColor(cc.status)}>
                      {cc.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
              <CardDescription>Network transaction statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockNetworkStatus.transactions.total.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {mockNetworkStatus.transactions.successful.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {mockNetworkStatus.transactions.failed}
                  </div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {mockNetworkStatus.transactions.pending}
                  </div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Transaction:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {mockNetworkStatus.transactions.lastTx}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
