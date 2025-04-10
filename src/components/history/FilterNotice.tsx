
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface FilterNoticeProps {
  isFiltered: boolean;
  userRole: string | null;
}

export function FilterNotice({ isFiltered, userRole }: FilterNoticeProps) {
  if (!isFiltered) return null;
  
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700">
        🔐 Filtered view – showing only relevant events for your role ({userRole}).
      </AlertDescription>
    </Alert>
  );
}
