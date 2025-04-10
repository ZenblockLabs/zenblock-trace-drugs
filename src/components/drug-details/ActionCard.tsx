
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import { Clock, Package } from "lucide-react";

interface ActionCardProps {
  drugId: string;
  userRole?: string;
}

export function ActionCard({ drugId, userRole }: ActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Available operations for this product</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <Button className="w-full justify-start" variant="outline" asChild>
            <RouterLink to={`/history?drugId=${drugId}`}>
              <Clock className="mr-2 h-4 w-4" />
              View Full History
            </RouterLink>
          </Button>
          
          {userRole === 'manufacturer' && (
            <Button className="w-full justify-start" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Transfer Ownership
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
