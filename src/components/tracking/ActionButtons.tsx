
import { Button } from "@/components/ui/button";
import { Flag, Info } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button variant="outline" className="flex gap-2">
        <Flag className="h-4 w-4" />
        Report Issue
      </Button>
      <Button variant="outline" className="flex gap-2">
        <Info className="h-4 w-4" />
        Learn About Traceability
      </Button>
    </div>
  );
}
