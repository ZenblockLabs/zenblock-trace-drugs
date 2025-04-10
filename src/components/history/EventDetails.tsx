
import { TrackingEvent } from "@/services/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { TemperatureLog } from "./TemperatureLog";
import { ShockEvents } from "./ShockEvents";

interface EventDetailsProps {
  event: TrackingEvent;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <>
      <Separator className="my-2" />
      <div className="mt-2">
        <p className="font-semibold">Additional Details:</p>
        <ul className="mt-1 space-y-1">
          {Object.entries(event.details).map(([key, value]) => {
            // Skip notes as we display them separately
            if (key === 'notes') return null;
            
            // Skip complex nested objects
            if (typeof value === 'object' && value !== null) return null;
            
            return (
              <li key={key} className="text-sm text-gray-700">
                <span className="font-medium capitalize">{key}:</span> {String(value)}
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Display temperature log if available */}
      {event.details.temperatureLog && event.details.temperatureLog.length > 0 && (
        <TemperatureLog logs={event.details.temperatureLog} />
      )}
      
      {/* Display shock events if available */}
      {event.details.shockEvents && event.details.shockEvents.length > 0 && (
        <ShockEvents shocks={event.details.shockEvents} />
      )}
      
      {event.details.notes && (
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <p className="text-sm">{event.details.notes}</p>
        </div>
      )}
      
      {/* Display blockchain verification status */}
      {event.details && event.details.isOnChain && (
        <div className="mt-3 flex items-center justify-end">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <ShieldCheck className="h-3 w-3 mr-1" /> 
            {event.details.blockchainHash 
              ? `Verified on block ${event.details.blockHeight}` 
              : 'Blockchain Verified'}
          </Badge>
        </div>
      )}
    </>
  );
}
