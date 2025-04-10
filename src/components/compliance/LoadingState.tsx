
import React from "react";
import { Loader } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading compliance data...</p>
    </div>
  );
}
