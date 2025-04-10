
import { TrackingEvent } from '../types';
import { drugEventsSet1 } from './mockEventsSet1';
import { drugEventsSet2 } from './mockEventsSet2';

// Combine all event sets into a single comprehensive list
export const mockEvents: TrackingEvent[] = [
  ...drugEventsSet1,
  ...drugEventsSet2
];
