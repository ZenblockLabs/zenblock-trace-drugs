
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TrackingLoader() {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/7f80b1a9-32ff-4729-bd56-1245ed723387.png" 
          alt="Zenblock Labs Logo" 
          className="h-16 w-16 mb-4" 
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Loading Drug Information...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <div className="pt-4">
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
