
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";

export function DrugNotFound() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2">Drug Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested drug information could not be found.</p>
            <Button asChild>
              <RouterLink to="/drugs">Back to Drugs</RouterLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
