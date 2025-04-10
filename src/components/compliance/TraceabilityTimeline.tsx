
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TrackingEvent, Drug } from "@/services/types";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, CheckCircle, XCircle, Clock, ArrowDown, ArrowUp, Package } from "lucide-react";

interface TraceabilityTimelineProps {
  drugId?: string;
  showFullDetails?: boolean;
}

export function TraceabilityTimeline({ drugId, showFullDetails = false }: TraceabilityTimelineProps) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [complianceStatus, setComplianceStatus] = useState<"compliant" | "warning" | "violated">("compliant");
  const [complianceIssues, setComplianceIssues] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      if (!drugId) return;
      
      try {
        setLoading(true);
        const service = await getBlockchainService(user?.email);
        
        const drugData = await service.getDrugById(drugId);
        setDrug(drugData);
        
        // Fetch all events for this drug (unfiltered)
        const allEvents = await service.getEventsByDrug(drugId);
        
        // Sort events by timestamp (oldest first for timeline)
        const sortedEvents = [...allEvents].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setEvents(sortedEvents);
        
        // Check compliance
        const issues = checkCompliance(sortedEvents);
        setComplianceIssues(issues);
        
        if (issues.length === 0) {
          setComplianceStatus("compliant");
        } else if (issues.some(issue => issue.includes("Missing required event") || issue.includes("Invalid flow"))) {
          setComplianceStatus("violated");
        } else {
          setComplianceStatus("warning");
        }
      } catch (error) {
        console.error("Failed to load traceability timeline:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [drugId, user?.email]);

  const checkCompliance = (events: TrackingEvent[]): string[] => {
    const issues: string[] = [];
    
    if (events.length === 0) {
      issues.push("No events recorded for this drug");
      return issues;
    }
    
    // Required event types in proper order
    const requiredSequence = ['commission', 'ship', 'receive', 'dispense'];
    let foundEvents = new Set<string>();
    
    // Check for required events
    events.forEach(event => {
      foundEvents.add(event.type.toLowerCase());
    });
    
    requiredSequence.forEach(required => {
      if (!foundEvents.has(required)) {
        issues.push(`Missing required event: ${required}`);
      }
    });
    
    // Check for logical flow (manufacturers → distributors → dispensers)
    let currentRole = "manufacturer";
    const roleOrder = ["manufacturer", "distributor", "dispenser"];
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const actorRole = typeof event.actor === 'string' 
        ? 'unknown' 
        : event.actor.role.toLowerCase();
      
      if (actorRole === 'regulator') continue; // Regulators can interact at any point
      
      const roleIndex = roleOrder.indexOf(actorRole);
      const currentRoleIndex = roleOrder.indexOf(currentRole);
      
      if (roleIndex < currentRoleIndex) {
        issues.push(`Invalid flow: ${actorRole} acted after ${currentRole} (Event: ${event.type})`);
      } else if (roleIndex > currentRoleIndex) {
        currentRole = actorRole;
      }
    }
    
    // Check for timeline gaps (more than 72 hours between events)
    const maxGapHours = 72;
    for (let i = 1; i < events.length; i++) {
      const prevTime = new Date(events[i-1].timestamp).getTime();
      const currTime = new Date(events[i].timestamp).getTime();
      const diffHours = (currTime - prevTime) / (1000 * 60 * 60);
      
      if (diffHours > maxGapHours) {
        issues.push(`Timeline gap of ${Math.round(diffHours)} hours between events ${i-1} and ${i}`);
      }
    }
    
    return issues;
  };

  const getComplianceBadge = () => {
    switch (complianceStatus) {
      case "compliant":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Fully Compliant
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Warning (Minor Violation)
          </Badge>
        );
      case "violated":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Non-Compliant
          </Badge>
        );
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'commission':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'ship':
        return <ArrowUp className="h-4 w-4 text-indigo-500" />;
      case 'receive':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traceability Timeline</CardTitle>
          <CardDescription>Loading timeline data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Traceability Timeline</CardTitle>
          <CardDescription>
            Full chain of custody verification
          </CardDescription>
        </div>
        {getComplianceBadge()}
      </CardHeader>
      <CardContent>
        {complianceIssues.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Compliance Issues Detected
            </h4>
            <ul className="text-xs text-amber-700 space-y-1 list-disc pl-5">
              {complianceIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Full timeline view */}
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
                  <TableCell>{formatDate(event.timestamp)}</TableCell>
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
      </CardContent>
    </Card>
  );
}
