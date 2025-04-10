
import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import { RecallStatus } from "@/components/RecallStatus";
import { Loader2, Clock, Map, Package } from "lucide-react";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { TrackingEvent } from "@/services/types";

interface TrackingContentProps {
  drugId: string;
  sgtin: string;
}

export function TrackingContent({ drugId, sgtin }: TrackingContentProps) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const service = await getBlockchainService();
        const drugEvents = await service.getEventsByDrug(drugId);
        setEvents(drugEvents);
      } catch (error) {
        console.error("Failed to fetch drug events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (drugId) {
      fetchEvents();
    }
  }, [drugId]);

  const renderTimeline = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          No tracking events found for this product.
        </div>
      );
    }

    // Sort events by timestamp (newest first)
    const sortedEvents = [...events].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
      <div className="space-y-4 mt-4">
        <ol className="relative border-l border-gray-200">
          {sortedEvents.map((event, index) => (
            <li className="mb-6 ml-6" key={event.id}>
              <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white">
                {getEventIcon(event.type)}
              </span>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold capitalize">{event.type}</h3>
                  <time className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </time>
                </div>
                <p className="mb-1 text-gray-700">
                  <span className="font-medium">Location:</span> {event.location || "Unknown"}
                </p>
                <p className="mb-1 text-gray-700">
                  <span className="font-medium">Handled by:</span>{" "}
                  {typeof event.actor === "string" ? event.actor : event.actor.name}
                </p>
                {event.details?.notes && (
                  <p className="text-gray-700">
                    <span className="font-medium">Notes:</span> {event.details.notes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "commission":
        return <Package className="h-3 w-3 text-white" />;
      case "ship":
      case "receive":
        return <Map className="h-3 w-3 text-white" />;
      default:
        return <Clock className="h-3 w-3 text-white" />;
    }
  };

  return (
    <CardContent className="py-6">
      <p className="text-gray-500 mb-6">Track the journey of this product through the supply chain.</p>
      
      {renderTimeline()}
      
      <div className="flex justify-center mt-6">
        <Button asChild>
          <RouterLink to={`/history?drugId=${drugId}`}>
            View Full Chain of Custody
          </RouterLink>
        </Button>
      </div>
      
      <RecallStatus sgtin={sgtin} className="mt-4" />
    </CardContent>
  );
}
