
import { Badge } from "@/components/ui/badge";
import { DrugStatus } from "@/services/types";

export function StatusInformation({ 
  status, 
  timestamp 
}: { 
  status: DrugStatus; 
  timestamp: string;
}) {
  const getStatusColor = (status: DrugStatus) => {
    switch (status) {
      case "manufactured":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "in-transit":
        return "bg-purple-100 text-purple-800";
      case "received":
        return "bg-green-100 text-green-800";
      case "dispensed":
        return "bg-teal-100 text-teal-800";
      case "recalled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Status Information</h3>
      <div className="flex items-center mb-3">
        <p className="text-sm text-gray-500 w-24">Current Status</p>
        <Badge className={`ml-2 ${getStatusColor(status)}`}>{status}</Badge>
      </div>
      <div>
        <p className="text-sm text-gray-500">Last Updated</p>
        <p className="font-medium">{timestamp}</p>
      </div>
    </div>
  );
}
