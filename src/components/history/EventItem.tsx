
import { TrackingEvent } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { getEventIcon, getEventColor } from "./EventIcons";
import { EventDetails } from "./EventDetails";

interface EventItemProps {
  event: TrackingEvent;
  formatDate: (dateString: string) => string;
}

export function EventItem({ event, formatDate }: EventItemProps) {
  return (
    <li className="mb-8 ml-6">
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
  );
}
