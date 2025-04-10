
import { TrackingEvent } from "@/services/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { EventItem } from "./EventItem";
import { getEventIcon, getEventColor } from "./EventIcons";

interface EventTimelineProps {
  events: TrackingEvent[];
  formatDate: (dateString: string) => string;
}

export function EventTimeline({ events, formatDate }: EventTimelineProps) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      {events.map((event, index) => (
        <EventItem key={event.id} event={event} formatDate={formatDate} />
      ))}
    </ol>
  );
}
