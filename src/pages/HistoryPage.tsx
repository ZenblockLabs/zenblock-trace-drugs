import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrackingEvent } from "@/services/types";
import { getBlockchainService } from "@/services/blockchainServiceFactory";

export function HistoryPage() {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const service = await getBlockchainService();
        const allEvents = await service.getAllEvents();
        setEvents(allEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Event History</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.type}</CardTitle>
              <CardDescription>
                <Badge>{new Date(event.timestamp).toLocaleDateString()}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Location: {event.location}</p>
              <p>Actor: {typeof event.actor === 'string' ? event.actor : event.actor.name}</p>
              <p>Details: {event.details.notes || 'No details provided'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
