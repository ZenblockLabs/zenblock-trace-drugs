
// Define core types used across blockchain services

export interface Drug {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  licenseNumber: string;
  sgtin: string;
  ownerId: string;
  ownerName: string;
  ownerRole: string;
  productName?: string;
  dosage?: string;
  status?: DrugStatus;
  currentOwnerId?: string;
  currentOwnerName?: string;
  currentOwnerRole?: string;
  gtin?: string;
  manufacturerId?: string;
  manufacturerName?: string;
}

export interface Actor {
  name: string;
  role: string;
  id?: string;
}

export interface TrackingEvent {
  id: string;
  drugId: string;
  type: string;
  timestamp: string;
  location: string;
  actor: string | Actor;
  details: Record<string, any>;
}

export type DrugStatus = 
  | 'manufactured'
  | 'shipped'
  | 'in-transit'
  | 'received'
  | 'dispensed'
  | 'recalled';

// Add the ComplianceReport interface to improve type safety
export interface ComplianceReport {
  id: string;
  title: string;
  period: string;
  timestamp: string;
  violations: number;
  complianceScore: number;
  details: Record<string, any>;
}

// Define the common interface for the blockchain service
export interface IFabricService {
  // Drug management
  registerDrug: (drugData: any) => Promise<Drug>;
  getAllDrugs: () => Promise<Drug[]>;
  getDrugsByOwner: (ownerId: string) => Promise<Drug[]>;
  getDrugById: (id: string) => Promise<Drug | null>;
  getDrugBySGTIN: (sgtin: string) => Promise<Drug | null>;
  
  // Event tracking
  createEvent: (eventData: any) => Promise<TrackingEvent>;
  getEventsByDrug: (drugId: string) => Promise<TrackingEvent[]>;
  getAllEvents: () => Promise<TrackingEvent[]>;
  getRecentEvents: (limit?: number) => Promise<TrackingEvent[]>;
  
  // Drug transfers
  transferDrug: (drugId: string, fromId: string, toId: string, toName: string, toRole: string, location: string, details: Record<string, any>) => Promise<boolean>;
  receiveDrug: (drugId: string, receiverId: string, receiverName: string, receiverRole: string, location: string, details: Record<string, any>) => Promise<boolean>;
  
  // Recall functionality
  initiateRecall: (sgtin: string, reason: string, initiator: any) => Promise<boolean>;
  checkRecallStatus: (sgtin: string) => Promise<any>;
  
  // Method to get drug details by SGTIN for public tracking
  getDrugDetailsBySGTIN: (sgtin: string) => Promise<any>;
  
  // Compliance methods
  getLatestComplianceReport: () => Promise<ComplianceReport>;
}
