
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { TrackingEvent } from "@/services/types";
import { getEventIcon, formatEventDate } from "@/utils/compliance/statusUtils";

interface TimelineTableProps {
  events: TrackingEvent[];
  showFullDetails?: boolean;
}

export function TimelineTable({ events, showFullDetails = false }: TimelineTableProps) {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Handler</TableHead>
            <TableHead>Location</TableHead>
            {showFullDetails && <TableHead>Details</TableHead>}
            <TableHead className="text-right">Verified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={event.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <TableCell className="font-medium flex items-center">
                {getEventIcon(event.type)}
                <span className="ml-2 capitalize">{event.type}</span>
              </TableCell>
              <TableCell>{formatEventDate(event.timestamp)}</TableCell>
              <TableCell>
                {typeof event.actor === 'string' 
                  ? event.actor 
                  : `${event.actor.name} (${event.actor.role})`}
              </TableCell>
              <TableCell>{event.location || "Unknown"}</TableCell>
              {showFullDetails && (
                <TableCell>
                  {event.details && Object.entries(event.details)
                    .filter(([key]) => key !== 'isOnChain' && key !== 'blockchainHash' && typeof event.details[key] !== 'object')
                    .map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium capitalize">{key}:</span> {String(value)}
                      </div>
                    ))}
                </TableCell>
              )}
              <TableCell className="text-right">
                {event.details?.isOnChain ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-xs">Unverified</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
