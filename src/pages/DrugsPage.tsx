import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug } from "@/services/types";
import { DrugCard } from "@/components/DrugCard";
import { Search, Filter } from "lucide-react";

export const DrugsPage = () => {
  const { user } = useAuth();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDrugs = async () => {
      setIsLoading(true);
      try {
        let drugData: Drug[] = [];
        const service = await getBlockchainService();
        
        if (user?.role === 'regulator') {
          // Regulators see all drugs
          drugData = await service.getAllDrugs();
        } else if (user?.id) {
          // Other roles see drugs they own or previously owned
          drugData = await service.getAllDrugs();
          // For now, show all drugs for demo purposes
        }
        
        setDrugs(drugData);
        setFilteredDrugs(drugData);
      } catch (error) {
        console.error("Error fetching drugs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDrugs();
  }, [user]);

  useEffect(() => {
    // Apply filters
    let results = drugs;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        drug =>
          drug.productName?.toLowerCase().includes(query) ||
          drug.sgtin?.toLowerCase().includes(query) ||
          drug.batchNumber?.toLowerCase().includes(query) ||
          drug.manufacturerName?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      results = results.filter(drug => drug.status === statusFilter);
    }
    
    setFilteredDrugs(results);
  }, [searchQuery, statusFilter, drugs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading drugs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Drug Catalog</h1>
        <p className="text-muted-foreground">
          Browse and search all pharmaceutical products in the supply chain
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific drugs by name, ID, or status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SGTIN, or batch number"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="manufactured">Manufactured</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="dispensed">Dispensed</SelectItem>
                  <SelectItem value="recalled">Recalled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredDrugs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDrugs.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-2 text-lg font-medium">No drugs found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
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
