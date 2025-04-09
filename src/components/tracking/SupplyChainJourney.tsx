
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrackingEvent {
  step: string;
  timestamp: string;
  location: string;
  handler: string;
  notes: string;
}

interface SupplyChainJourneyProps {
  events: TrackingEvent[];
  formatDate: (dateString: string) => string;
}

export function SupplyChainJourney({ events, formatDate }: SupplyChainJourneyProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Supply Chain Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          {events.map((event, index) => (
            <li key={index} className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white">
                <span className="text-white text-xs">{index + 1}</span>
              </span>
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.step}</h3>
                  <time className="text-xs font-normal text-gray-500">
                    {formatDate(event.timestamp)}
                  </time>
                </div>
                <p className="mb-2 text-gray-700">
                  <span className="font-semibold">Handler:</span> {event.handler}
                </p>
                <p className="mb-2 text-gray-700">
                  <span className="font-semibold">Location:</span> {event.location}
                </p>
                {event.notes && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Notes:</span> {event.notes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
