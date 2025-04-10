
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  drugId: string | null;
}

export function EmptyState({ drugId }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="mb-2 text-lg font-medium">No events found</p>
        <p className="text-sm text-muted-foreground">
          {drugId 
            ? 'This product has no recorded tracking events yet.' 
            : 'There are no tracking events in the system yet.'}
        </p>
      </CardContent>
    </Card>
  );
}
