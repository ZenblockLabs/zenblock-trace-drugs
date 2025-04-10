
import { TrackingEvent } from "@/services/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowUp, ArrowDown, Clock, AlertTriangle, ShieldCheck, Info } from "lucide-react";

interface EventTimelineProps {
  events: TrackingEvent[];
  formatDate: (dateString: string) => string;
}

export function EventTimeline({ events, formatDate }: EventTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commission':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'qa-passed':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'ship':
        return <ArrowUp className="h-5 w-5 text-indigo-500" />;
      case 'receive':
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case 'recall':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warehouse':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'dispense':
        return <Package className="h-5 w-5 text-teal-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getEventColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commission':
        return 'bg-blue-100 text-blue-800';
      case 'qa-passed':
        return 'bg-green-100 text-green-800';
      case 'ship':
        return 'bg-indigo-100 text-indigo-800';
      case 'receive':
        return 'bg-green-100 text-green-800';
      case 'recall':
        return 'bg-red-100 text-red-800';
      case 'warehouse':
        return 'bg-purple-100 text-purple-800';
      case 'dispense':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      {events.map((event, index) => (
        <li key={event.id} className="mb-8 ml-6">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
            {getEventIcon(event.type)}
          </span>
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <Badge className={getEventColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              <time className="text-xs font-normal text-gray-500">
                {formatDate(event.timestamp)}
              </time>
            </div>
            
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {typeof event.actor === 'string' 
                ? event.actor 
                : `${event.actor.name} (${event.actor.role})`}
            </h3>
            
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Location:</span> {event.location || 'Unknown'}
            </p>
            
            {event.details && Object.keys(event.details).length > 0 && (
              <EventDetails event={event} />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

interface EventDetailsProps {
  event: TrackingEvent;
}

function EventDetails({ event }: EventDetailsProps) {
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
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <p className="text-sm font-medium mb-1">Temperature Log:</p>
          <ul className="text-xs space-y-1">
            {event.details.temperatureLog.map((log: any, i: number) => (
              <li key={i} className="text-gray-600">
                {new Date(log.timestamp).toLocaleString()}: {log.temperature}°{log.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Display shock events if available */}
      {event.details.shockEvents && event.details.shockEvents.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 rounded">
          <p className="text-sm font-medium mb-1 text-yellow-700">Shock Events Detected:</p>
          <ul className="text-xs space-y-1">
            {event.details.shockEvents.map((shock: any, i: number) => (
              <li key={i} className="text-yellow-800">
                {new Date(shock.timestamp).toLocaleString()}: {shock.gForce}g at {shock.location}
              </li>
            ))}
          </ul>
        </div>
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
