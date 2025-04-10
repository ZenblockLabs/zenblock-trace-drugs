
export type DrugStatus = 
  | 'manufactured' 
  | 'shipped' 
  | 'in-transit' 
  | 'received' 
  | 'warehoused' 
  | 'dispensed' 
  | 'recalled';

export type EventType = 
  | 'commission' 
  | 'ship' 
  | 'receive' 
  | 'warehouse'
  | 'dispense' 
  | 'recall'
  | 'qa-passed';

export type UserRole = 'manufacturer' | 'distributor' | 'dispenser' | 'regulator';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface Actor {
  id: string;
  name: string;
  role: string;
  organization: string;
}

export interface EventMetadata {
  temperatureCheckPassed?: boolean;
  digitalSignature?: string;
  geoCoordinates?: GeoCoordinates;
  isOnChain?: boolean;
  verificationHash?: string;
  notes?: string;
  [key: string]: any;
}

export interface Drug {
  id: string;
  gtin: string;
  sgtin: string;
  batchNumber: string;
  manufacturerId: string;
  manufacturerName: string;
  expiryDate: string;
  productName: string;
  dosage: string;
  description?: string;
  status: DrugStatus;
  currentOwnerId: string;
  currentOwnerName: string;
  currentOwnerRole: string;
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  drugId: string;
  eventType: EventType;
  location: string;
  actor: Actor;
  details: EventMetadata;
}

export interface RecallInfo {
  sgtin: string;
  reason: string;
  initiatedBy: string | Actor;
  timestamp: string;
}

// Role-based event visibility mapping
export const ROLE_EVENT_VISIBILITY: Record<UserRole, EventType[] | null> = {
  'manufacturer': ['commission', 'qa-passed', 'ship'],
  'distributor': ['receive', 'warehouse', 'ship'],
  'dispenser': ['receive', 'dispense'],
  'regulator': null // null means all events are visible
};

// Status derivation from event types
export const EVENT_TO_STATUS_MAP: Record<EventType, DrugStatus> = {
  'commission': 'manufactured',
  'qa-passed': 'manufactured',
  'ship': 'shipped',
  'receive': 'received',
  'warehouse': 'warehoused',
  'dispense': 'dispensed',
  'recall': 'recalled'
};
