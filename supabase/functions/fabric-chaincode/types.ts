
export type DrugStatus = 
  | 'manufactured' 
  | 'shipped' 
  | 'in-transit' 
  | 'received' 
  | 'dispensed' 
  | 'recalled';

export type EventType = 
  | 'commission' 
  | 'ship' 
  | 'receive' 
  | 'dispense' 
  | 'recall';

export interface Actor {
  id: string;
  name: string;
  role: string;
  organization: string;
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
  details: Record<string, any>;
}
