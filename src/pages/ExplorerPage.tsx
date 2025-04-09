
import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Database, Link as LinkIcon } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { TrackingEvent } from "@/services/types";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface Actor {
  name: string;
  role: string;
}

interface Block {
  id: string;
  number: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  txCount: number;
}

const generateMockBlocks = (events: TrackingEvent[]): Block[] => {
  const blocks: Block[] = [];
  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
  
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.timestamp.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, TrackingEvent[]>);
  
  Object.keys(eventsByDate).forEach((date, index) => {
    const eventsInBlock = eventsByDate[date];
    const hash = `block${index}${Math.random().toString(36).substring(2, 10)}`;
    
    blocks.push({
      id: `block-${index}`,
      number: index,
      hash,
      previousHash: prevHash,
      timestamp: new Date(date).toISOString(),
      txCount: eventsInBlock.length
    });
    
    prevHash = hash;
  });
  
  return blocks.sort((a, b) => b.number - a.number);
};

export function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("blocks");
  const [blocks, setBlocks] = useState<Block[]>([]);
  
  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['explorer-events'],
    queryFn: async () => {
      const service = await getBlockchainService();
      return service.getAllEvents();
    }
  });
  
  useEffect(() => {
    if (events.length > 0) {
      setBlocks(generateMockBlocks(events));
    }
  }, [events]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
        <div className="w-1/3">
          <Input 
            placeholder="Search by ID, hash, or content..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Explorer</CardTitle>
          <CardDescription>
            View detailed information about blocks, transactions, and events in the blockchain
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="blocks" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start px-6">
            <TabsTrigger value="blocks">
              <Database className="h-4 w-4 mr-2" />
              Blocks
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <LinkIcon className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            {activeTab === "blocks" && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest Blocks</CardTitle>
                  <CardDescription>
                    Recently mined blocks on the ZenBlock ledger
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingEvents ? (
                    <div className="text-center py-4">Loading blocks...</div>
                  ) : blocks.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Block</TableHead>
                          <TableHead>Hash</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead className="text-right">Transactions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blocks.map((block) => (
                          <TableRow key={block.id}>
                            <TableCell>
                              <div className="font-medium">#{block.number}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-mono text-xs truncate max-w-[120px] md:max-w-[200px]">
                                {block.hash}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Prev: <span className="font-mono truncate">{block.previousHash.substring(0, 7)}...</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(block.timestamp), 'MMM d, yyyy h:mm a')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge>{block.txCount}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">No blocks found</div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === "transactions" && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest Transactions</CardTitle>
                  <CardDescription>
                    Recent transactions on the ZenBlock ledger
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tx ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingEvents ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">Loading transactions...</TableCell>
                        </TableRow>
                      ) : events.length > 0 ? (
                        events.slice(0, 10).map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>
                              <div className="font-mono text-xs truncate max-w-[120px] md:max-w-[120px]">
                                {event.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {event.eventType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                            </TableCell>
                            <TableCell>
                              <Badge variant="success">SUCCESS</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">No transactions found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "events" && (
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Events</CardTitle>
                  <CardDescription>
                    EPCIS tracking events in the pharmaceutical supply chain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event ID</TableHead>
                        <TableHead>Drug ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingEvents ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">Loading events...</TableCell>
                        </TableRow>
                      ) : events.length > 0 ? (
                        events.slice(0, 10).map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>
                              <div className="font-mono text-xs truncate max-w-[80px] md:max-w-[120px]">
                                {event.id.substring(0, 8)}...
                              </div>
                            </TableCell>
                            <TableCell>
                              <Link 
                                to={`/drugs/${event.drugId}`}
                                className="font-mono text-xs text-blue-600 hover:underline truncate max-w-[80px] md:max-w-[120px] inline-block"
                              >
                                {event.drugId.substring(0, 8)}...
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {event.eventType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {event.actor.name}
                                <div className="text-xs text-muted-foreground capitalize">
                                  ({event.actor.role})
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link 
                                to={`/history?drugId=${event.drugId}`}
                                className="text-blue-600 hover:underline text-sm inline-flex items-center"
                              >
                                Details 
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">No events found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Tabs>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Network Information</CardTitle>
          <CardDescription>
            Details about the Hyperledger Fabric network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Network Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Channel Name:</span>
                  <span className="font-medium">zenblock-channel</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Chaincode Name:</span>
                  <span className="font-medium">zenblock-cc</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Fabric Version:</span>
                  <span className="font-medium">2.5.0</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Current Block Height:</span>
                  <span className="font-medium">{blocks.length}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Organizations</h3>
              <div className="space-y-3">
                <div className="border rounded-md p-2">
                  <div className="font-medium">ManufacturerOrg (Org1)</div>
                  <div className="text-xs text-muted-foreground mt-1">Peers: 1 | MSP ID: Org1MSP</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="font-medium">DistributorOrg (Org2)</div>
                  <div className="text-xs text-muted-foreground mt-1">Peers: 1 | MSP ID: Org2MSP</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="font-medium">OrdererOrg</div>
                  <div className="text-xs text-muted-foreground mt-1">Orderers: 1 | Consensus: RAFT</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
