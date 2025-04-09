
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug, TrackingEvent } from "@/services/mockBlockchainService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, Search, ListFilter, Pill } from "lucide-react";
import { format } from "date-fns";

export const RecallReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const service = await getBlockchainService();
        
        // Get all drugs
        const allDrugs = await service.getAllDrugs();
        
        // Filter recalled drugs
        const recalledDrugs = allDrugs.filter(drug => drug.status === 'recalled');
        setDrugs(recalledDrugs);
        
        // Get all events
        const allEvents = await service.getAllEvents();
        
        // Filter recall events
        const recallEvents = allEvents.filter(event => 
          event.eventType === 'recall' && 
          recalledDrugs.some(drug => drug.id === event.drugId)
        );
        
        setEvents(recallEvents);
      } catch (error) {
        console.error("Error fetching recall data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to get the recall event for a specific drug
  const getRecallEventForDrug = (drugId: string) => {
    return events.find(event => event.drugId === drugId && event.eventType === 'recall');
  };
  
  // Filter drugs based on search term
  const filteredDrugs = drugs.filter(drug => 
    drug.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.sgtin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recall Reports</h1>
          <p className="text-muted-foreground">
            Monitor and manage product recalls across the supply chain
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-red-50/50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Active Recalls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name, SGTIN or batch number..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : filteredDrugs.length === 0 ? (
            <div className="p-8 text-center">
              <Pill className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No recalled products found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? "Try a different search term" : "There are currently no active recalls in the system"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SGTIN</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Recall Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrugs.map((drug) => {
                    const recallEvent = getRecallEventForDrug(drug.id);
                    
                    return (
                      <TableRow key={drug.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {drug.productName}
                            <StatusBadge status={drug.status} />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {drug.sgtin}
                        </TableCell>
                        <TableCell>{drug.batchNumber}</TableCell>
                        <TableCell>{drug.manufacturerName}</TableCell>
                        <TableCell>
                          {recallEvent ? (
                            format(new Date(recallEvent.timestamp), "MMM d, yyyy")
                          ) : (
                            "Unknown"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {recallEvent?.details?.reason || "No reason provided"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                          >
                            <Link to={`/drugs/${drug.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
