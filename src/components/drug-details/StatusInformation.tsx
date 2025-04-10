
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Clock } from "lucide-react";

interface StatusInformationProps {
  status: string;
  ownerName: string;
  ownerRole?: string;
}

export function StatusInformation({ status, ownerName, ownerRole }: StatusInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Information</CardTitle>
        <CardDescription>Current product status and location</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Current Status:</p>
            <div className="mt-1">
              <StatusBadge size="lg" status={status || 'manufactured'} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Owner:</p>
            <p className="font-medium">{ownerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Owner Type:</p>
            <p className="font-medium">{ownerRole || 'Distributor'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated:</p>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <p className="font-medium">{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
