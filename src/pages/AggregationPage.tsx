import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Box, Layers } from "lucide-react";

export default function AggregationPage() {
  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  // Fetch aggregation tree
  const { data: aggregations } = useQuery({
    queryKey: ["aggregations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aggregations")
        .select("*, batches(batch_number, product_name)")
        .eq("status", "active")
        .order("aggregation_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Group by parent
  const aggregationTree = aggregations?.reduce((acc, agg) => {
    if (!acc[agg.parent_id]) {
      acc[agg.parent_id] = {
        parentId: agg.parent_id,
        parentType: agg.parent_type,
        batchInfo: agg.batches,
        children: [],
      };
    }
    acc[agg.parent_id].children.push({
      childId: agg.child_id,
      childType: agg.child_type,
      aggregationDate: agg.aggregation_date,
    });
    return acc;
  }, {} as Record<string, any>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pallet':
        return <Layers className="h-4 w-4" />;
      case 'case':
        return <Box className="h-4 w-4" />;
      case 'unit':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const stats = {
    totalPallets: Object.values(aggregationTree || {}).filter((a: any) => a.parentType === 'pallet').length,
    totalCases: Object.values(aggregationTree || {}).filter((a: any) => a.parentType === 'case').length,
    totalUnits: aggregations?.reduce((sum, agg) => sum + (agg.child_type === 'unit' ? 1 : 0), 0) || 0,
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Aggregation Tracking</h1>
          <p className="text-muted-foreground">
            Hierarchical view of packaging (Pallet → Case → Unit)
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pallets</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPallets}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cases</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Units</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUnits}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aggregation Tree</CardTitle>
            <CardDescription>Package hierarchy visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aggregationTree && Object.values(aggregationTree).map((parent: any) => (
                <div
                  key={parent.parentId}
                  className="border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedParent(parent.parentId)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(parent.parentType)}
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {parent.parentType}
                          </Badge>
                          <span className="text-sm font-mono">{parent.parentId.slice(0, 8)}...</span>
                        </div>
                        {parent.batchInfo && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {parent.batchInfo.product_name} - {parent.batchInfo.batch_number}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary">{parent.children.length} items</Badge>
                  </div>

                  {selectedParent === parent.parentId && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="text-sm font-medium mb-2">Contents:</div>
                      {parent.children.map((child: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm pl-6">
                          {getTypeIcon(child.childType)}
                          <span className="capitalize">{child.childType}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {child.childId.slice(0, 8)}...
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(child.aggregationDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {!aggregationTree || Object.keys(aggregationTree).length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No aggregations found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
