
import { TrackingEvent } from "@/services/types";

/**
 * Checks compliance of drug events based on DSCSA requirements
 */
export const checkCompliance = (events: TrackingEvent[]): string[] => {
  const issues: string[] = [];
  
  // Check if there are any events
  if (events.length === 0) {
    issues.push("No events recorded for this drug");
    return issues;
  }
  
  // Sort events by timestamp
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Required event types in proper order
  const requiredSequence = ['commission', 'ship', 'receive', 'dispense'];
  let foundEvents = new Set<string>();
  
  // Check for required events
  sortedEvents.forEach(event => {
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
  
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
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
  for (let i = 1; i < sortedEvents.length; i++) {
    const prevTime = new Date(sortedEvents[i-1].timestamp).getTime();
    const currTime = new Date(sortedEvents[i].timestamp).getTime();
    const diffHours = (currTime - prevTime) / (1000 * 60 * 60);
    
    if (diffHours > maxGapHours) {
      issues.push(`Timeline gap of ${Math.round(diffHours)} hours between events`);
    }
  }
  
  return issues;
};
