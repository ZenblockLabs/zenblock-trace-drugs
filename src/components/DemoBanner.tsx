import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export const DemoBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/90 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 relative">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>
        <strong>Demo Environment</strong> — This app uses mock authentication for demonstration purposes only. Do not use in production.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-600/50 rounded"
        aria-label="Dismiss demo warning"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};
