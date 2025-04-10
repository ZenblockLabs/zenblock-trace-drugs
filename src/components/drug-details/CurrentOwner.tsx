
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CurrentOwner({
  ownerName,
  ownerRole
}: {
  ownerName: string;
  ownerRole?: string;
}) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-lg font-medium mb-4">Current Owner</h3>
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-blue-200 p-3 rounded-full">
            <Building2 className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <p className="font-medium text-lg">{ownerName}</p>
            <p className="text-blue-700">{ownerRole || 'Distributor'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
