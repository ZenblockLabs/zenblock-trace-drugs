import { v4 as uuidv4 } from 'uuid';

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

export type DrugStatus = 
  | 'manufactured' 
  | 'shipped' 
  | 'in-transit' 
  | 'received' 
  | 'dispensed' 
  | 'recalled';

export interface TrackingEvent {
  id: string;
  timestamp: string;
  drugId: string;
  eventType: 'commission' | 'ship' | 'receive' | 'dispense' | 'recall';
  location: string;
  actor: {
    id: string;
    name: string;
    role: string;
    organization: string;
  };
  details: Record<string, any>;
}

export interface ComplianceReport {
  id: string;
  title: string;
  timestamp: string;
  period: 'month' | 'quarter' | 'year';
  complianceScore: number;
  violations: number;
  details: Record<string, any>;
}

// In-memory storage for our mock blockchain
let drugs: Drug[] = [];
let events: TrackingEvent[] = [];
let complianceReports: ComplianceReport[] = [];
let recalls: Record<string, any> = {};

// Initialize with some mock data
const initMockData = () => {
  // Only initialize once
  if (drugs.length > 0) return;

  // Generate 10 sample drugs
  const manufacturers = [
    { id: 'manu1', name: 'ZenPharma Inc.' },
    { id: 'manu2', name: 'MediCorp Pharmaceuticals' }
  ];
  
  const productNames = [
    'ZenRelief',
    'CardioZen',
    'ImmunoBoost',
    'NeuroPlex',
    'GastroEase',
    'ArthroFlex',
    'DermaCalm',
    'RespiClear',
    'MetaBalance',
    'VitaZen'
  ];
  
  for (let i = 0; i < 10; i++) {
    const manufacturer = manufacturers[i % 2];
    const gtin = `0${(i + 1).toString().padStart(13, '0')}`;
    const sgtin = `sgtin:0${(i + 1).toString().padStart(13, '0')}.${Math.floor(Math.random() * 1000000)}`;
    const batchNumber = `BATCH-${Math.floor(Math.random() * 10000)}`;
    
    // Random date between now and 3 years in the future
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 3) + 1);
    
    const newDrug: Drug = {
      id: uuidv4(),
      gtin,
      sgtin,
      batchNumber,
      manufacturerId: manufacturer.id,
      manufacturerName: manufacturer.name,
      expiryDate: expiryDate.toISOString().split('T')[0],
      productName: productNames[i],
      dosage: ['10mg', '25mg', '50mg', '100mg'][Math.floor(Math.random() * 4)],
      description: `${productNames[i]} is used to treat various conditions including...`,
      status: 'manufactured',
      currentOwnerId: manufacturer.id,
      currentOwnerName: manufacturer.name,
      currentOwnerRole: 'manufacturer'
    };
    
    drugs.push(newDrug);
    
    // Create a commission event for this drug
    const commissionEvent: TrackingEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      drugId: newDrug.id,
      eventType: 'commission',
      location: 'Manufacturing Facility, CA, USA',
      actor: {
        id: manufacturer.id,
        name: manufacturer.name,
        role: 'manufacturer',
        organization: manufacturer.name
      },
      details: {
        batchNumber,
        productionLine: `Line-${Math.floor(Math.random() * 10) + 1}`
      }
    };
    
    events.push(commissionEvent);
  }
  
  // For the first 3 drugs, create a shipping event to the distributor
  for (let i = 0; i < 3; i++) {
    const drug = drugs[i];
    
    // Update drug status
    drug.status = 'shipped';
    drug.currentOwnerId = 'dist1';
    drug.currentOwnerName = 'MediDistribute LLC';
    drug.currentOwnerRole = 'distributor';
    
    const shipEvent: TrackingEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      drugId: drug.id,
      eventType: 'ship',
      location: 'Manufacturing Facility, CA, USA',
      actor: {
        id: drug.manufacturerId,
        name: drug.manufacturerName,
        role: 'manufacturer',
        organization: drug.manufacturerName
      },
      details: {
        destination: 'MediDistribute LLC, NV, USA',
        shipmentId: `SHP-${Math.floor(Math.random() * 100000)}`,
        carrier: 'SecurePharmLogistics'
      }
    };
    
    events.push(shipEvent);
  }
  
  // For the first drug, create a receive event at the distributor
  const receivedDrug = drugs[0];
  receivedDrug.status = 'received';
  
  const receiveEvent: TrackingEvent = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    drugId: receivedDrug.id,
    eventType: 'receive',
    location: 'Distribution Center, NV, USA',
    actor: {
      id: 'dist1',
      name: 'MediDistribute LLC',
      role: 'distributor',
      organization: 'MediDistribute LLC'
    },
    details: {
      receivedBy: 'Warehouse Manager',
      verificationStatus: 'Verified',
      condition: 'Excellent'
    }
  };
  
  events.push(receiveEvent);
};

// Initialize the mock data
initMockData();

// Service methods
export const mockBlockchainService = {
  // Drug management
  registerDrug: async (drugData: Omit<Drug, 'id' | 'sgtin' | 'status' | 'currentOwnerId' | 'currentOwnerName' | 'currentOwnerRole'>): Promise<Drug> => {
    const sgtin = `sgtin:${drugData.gtin}.${Math.floor(Math.random() * 1000000)}`;
    
    const newDrug: Drug = {
      id: uuidv4(),
      ...drugData,
      sgtin,
      status: 'manufactured',
      currentOwnerId: drugData.manufacturerId,
      currentOwnerName: drugData.manufacturerName,
      currentOwnerRole: 'manufacturer'
    };
    
    drugs.push(newDrug);
    
    // Create a commission event
    const commissionEvent: TrackingEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      drugId: newDrug.id,
      eventType: 'commission',
      location: 'Manufacturing Facility',
      actor: {
        id: drugData.manufacturerId,
        name: drugData.manufacturerName,
        role: 'manufacturer',
        organization: drugData.manufacturerName
      },
      details: {
        batchNumber: drugData.batchNumber,
        productionLine: 'Production Line 1'
      }
    };
    
    events.push(commissionEvent);
    
    return newDrug;
  },
  
  getAllDrugs: async (): Promise<Drug[]> => {
    return [...drugs];
  },
  
  getDrugsByOwner: async (ownerId: string): Promise<Drug[]> => {
    return drugs.filter(drug => drug.currentOwnerId === ownerId);
  },
  
  getDrugById: async (id: string): Promise<Drug | null> => {
    const drug = drugs.find(d => d.id === id);
    return drug || null;
  },
  
  getDrugBySGTIN: async (sgtin: string): Promise<Drug | null> => {
    const drug = drugs.find(d => d.sgtin === sgtin);
    return drug || null;
  },
  
  // Event tracking
  createEvent: async (eventData: Omit<TrackingEvent, 'id' | 'timestamp'>): Promise<TrackingEvent> => {
    const newEvent: TrackingEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...eventData
    };
    
    events.push(newEvent);
    
    // Update drug status based on event
    const drug = drugs.find(d => d.id === eventData.drugId);
    if (drug) {
      switch (eventData.eventType) {
        case 'commission':
          drug.status = 'manufactured';
          break;
        case 'ship':
          drug.status = 'shipped';
          break;
        case 'receive':
          drug.status = 'received';
          // Update current owner
          drug.currentOwnerId = eventData.actor.id;
          drug.currentOwnerName = eventData.actor.name;
          drug.currentOwnerRole = eventData.actor.role;
          break;
        case 'dispense':
          drug.status = 'dispensed';
          break;
        case 'recall':
          drug.status = 'recalled';
          break;
      }
    }
    
    return newEvent;
  },
  
  getEventsByDrug: async (drugId: string): Promise<TrackingEvent[]> => {
    return events
      .filter(event => event.drugId === drugId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },
  
  getAllEvents: async (): Promise<TrackingEvent[]> => {
    return [...events].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
  
  getRecentEvents: async (limit: number = 10): Promise<TrackingEvent[]> => {
    return [...events]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  transferDrug: async (drugId: string, fromId: string, toId: string, toName: string, toRole: string, location: string, details: Record<string, any>): Promise<boolean> => {
    const drug = drugs.find(d => d.id === drugId && d.currentOwnerId === fromId);
    
    if (!drug) {
      return false;
    }
    
    // Create ship event
    await mockBlockchainService.createEvent({
      drugId,
      eventType: 'ship',
      location,
      actor: {
        id: fromId,
        name: drug.currentOwnerName,
        role: drug.currentOwnerRole,
        organization: drug.currentOwnerName
      },
      details: {
        destination: toName,
        ...details
      }
    });
    
    // Update drug status and owner
    drug.status = 'in-transit';
    drug.currentOwnerId = toId;
    drug.currentOwnerName = toName;
    drug.currentOwnerRole = toRole;
    
    return true;
  },
  
  receiveDrug: async (drugId: string, receiverId: string, receiverName: string, receiverRole: string, location: string, details: Record<string, any>): Promise<boolean> => {
    const drug = drugs.find(d => d.id === drugId && d.currentOwnerId === receiverId);
    
    if (!drug) {
      return false;
    }
    
    // Create receive event
    await mockBlockchainService.createEvent({
      drugId,
      eventType: 'receive',
      location,
      actor: {
        id: receiverId,
        name: receiverName,
        role: receiverRole,
        organization: receiverName
      },
      details
    });
    
    // Update drug status
    drug.status = 'received';
    
    return true;
  },
  
  // Drug transfers
  initiateRecall: async (sgtin: string, reason: string, initiator: any): Promise<boolean> => {
    const drug = drugs.find(d => d.sgtin === sgtin);
    
    if (!drug) {
      throw new Error(`Drug with SGTIN ${sgtin} not found`);
    }
    
    // Store recall information
    recalls[sgtin] = {
      sgtin,
      reason,
      initiatedBy: initiator,
      timestamp: new Date().toISOString()
    };
    
    // Update drug status
    drug.status = 'recalled';
    
    // Create a recall event
    await mockBlockchainService.createEvent({
      drugId: drug.id,
      eventType: 'recall',
      location: 'System',
      actor: {
        id: typeof initiator === 'string' ? initiator : initiator.id,
        name: typeof initiator === 'string' ? 'System' : initiator.name,
        role: typeof initiator === 'string' ? 'system' : initiator.role,
        organization: typeof initiator === 'string' ? 'System' : initiator.organization
      },
      details: {
        reason,
        recallId: Math.random().toString(36).substring(2, 15)
      }
    });
    
    return true;
  },
  
  checkRecallStatus: async (sgtin: string): Promise<any> => {
    const recallInfo = recalls[sgtin];
    
    return {
      isRecalled: !!recallInfo,
      recallDetails: recallInfo || null
    };
  },
  
  // Compliance reporting
  generateComplianceReport: async (period: 'month' | 'quarter' | 'year'): Promise<ComplianceReport> => {
    const now = new Date();
    
    const getTimePeriodLabel = (period: 'month' | 'quarter' | 'year') => {
      if (period === 'month') {
        return `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
      } else if (period === 'quarter') {
        const quarter = Math.floor(now.getMonth() / 3) + 1;
        return `Q${quarter} ${now.getFullYear()}`;
      } else {
        return `${now.getFullYear()}`;
      }
    };
    
    const newReport: ComplianceReport = {
      id: uuidv4(),
      title: `DSCSA Compliance Report - ${getTimePeriodLabel(period)}`,
      timestamp: now.toISOString(),
      period,
      complianceScore: 95 + Math.random() * 5, // Random score between 95-100%
      violations: Math.floor(Math.random() * 3), // 0-2 violations
      details: {
        totalDrugs: drugs.length,
        trackedEvents: events.length,
        traceabilityCompleteness: 98.5,
        t3Compliance: true,
        identifierCompliance: true,
        verificationResponseTime: '0.5s',
      }
    };
    
    complianceReports.push(newReport);
    return newReport;
  },
  
  getComplianceReports: async (): Promise<ComplianceReport[]> => {
    return [...complianceReports].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
  
  getLatestComplianceReport: async (): Promise<ComplianceReport | null> => {
    if (complianceReports.length === 0) {
      return null;
    }
    
    return [...complianceReports].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  },
  
  // Add the missing getDrugDetailsBySGTIN method
  getDrugDetailsBySGTIN: async (sgtin: string): Promise<any> => {
    console.log('MockBlockchainService.getDrugDetailsBySGTIN called for:', sgtin);
    
    // Check if this is a recalled code
    const isRecalled = !!recalls[sgtin];
    
    // Get drug by SGTIN
    const drug = drugs.find(d => d.sgtin === sgtin);
    
    // If drug exists, return its details
    if (drug) {
      // Get events for this drug
      const drugEvents = events.filter(event => event.drugId === drug.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Format events for public API
      const formattedEvents = drugEvents.map(event => ({
        step: event.eventType === 'commission' ? 'Manufactured' :
              event.eventType === 'ship' ? 'Shipped' :
              event.eventType === 'receive' ? `Received by ${event.actor.role}` :
              event.eventType === 'dispense' ? 'Dispensed' :
              event.eventType === 'recall' ? 'Recalled' : 'Other',
        timestamp: event.timestamp,
        location: event.location,
        handler: event.actor.name,
        notes: event.details?.notes || ''
      }));
      
      return {
        drug: {
          name: drug.productName,
          manufacturer: drug.manufacturerName,
          batchId: drug.batchNumber,
          expiry: drug.expiryDate,
          license: "MH/DRUGS/1191", // This would come from a real database
          sgtin: drug.sgtin
        },
        events: formattedEvents,
        status: {
          isRecalled: isRecalled,
          message: isRecalled 
            ? "⚠️ This batch has been recalled. Do not use." 
            : "✅ This batch is genuine and traceable.",
          verifiedBy: "Zenblock Labs"
        }
      };
    }
    
    // If drug doesn't exist in our database, generate mock data for demo purposes
    // This would be similar to the Edge Function's getTraceabilityData
    // In production, this would be an error if the drug doesn't exist
    
    return {
      drug: {
        name: sgtin.startsWith('ZBL-A') ? "Amoxiflox 500" : "Zenbiotic Plus",
        manufacturer: "XYZ Pharma Ltd",
        batchId: `BATCH-${sgtin.substring(sgtin.length - 5)}`,
        expiry: "2026-01-01",
        license: "MH/DRUGS/1191",
        sgtin: sgtin
      },
      events: [
        {
          step: "Manufactured",
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Baddi, HP",
          handler: "XYZ Pharma Ltd",
          notes: "Batch created"
        },
        {
          step: "Quality Control",
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Baddi, HP",
          handler: "XYZ Pharma QA Team",
          notes: "Batch passed all quality tests"
        },
        {
          step: "Shipped",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Baddi, HP",
          handler: "XYZ Pharma Ltd",
          notes: "Shipped to MedEx Distributors"
        },
        {
          step: "Received by Distributor",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Mumbai, MH",
          handler: "MedEx Distributors",
          notes: "Inventory verified and stored"
        }
      ],
      status: {
        isRecalled: isRecalled,
        message: isRecalled 
          ? "⚠️ This batch has been recalled. Do not use." 
          : "✅ This batch is genuine and traceable.",
        verifiedBy: "Zenblock Labs"
      }
    };
  }
};
