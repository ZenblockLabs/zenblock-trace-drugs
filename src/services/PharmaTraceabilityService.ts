
import { PHARMA_API_CONFIG } from '@/config/pharmaConfig';

export interface VerificationRequest {
  gtin: string;
  lotNumber: string;
  serialNumber: string;
  expiryDate: string;
}

export interface VerificationResponse {
  status: string;
  isValid: boolean;
  product: {
    name: string;
    manufacturer: string;
    gtin: string;
    lotNumber: string;
    serialNumber: string;
    expiryDate: string;
  };
  alerts?: string[];
}

export interface TraceRequest {
  gtin?: string;
  lotNumber?: string;
  serialNumber?: string;
}

export interface TraceEvent {
  id: string;
  type: 'commission' | 'ship' | 'receive' | 'dispense';
  timestamp: string;
  location: string;
  organization: string;
  role: string;
  details: Record<string, any>;
}

export interface TraceResponse {
  product: {
    name: string;
    manufacturer: string;
    gtin: string;
    lotNumber: string;
    serialNumber: string;
  };
  events: TraceEvent[];
  permissionLevel: 'one-up-one-down' | 'manufacturer' | 'full';
}

export interface Alert {
  id: string;
  type: 'recall' | 'investigation' | 'evaluation';
  status: string;
  product: {
    name: string;
    gtin: string;
    lotNumber?: string;
  };
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUnits?: number;
}

export class PharmaTraceabilityService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = PHARMA_API_CONFIG.baseUrl;
  }

  async verifyProduct(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${PHARMA_API_CONFIG.endpoints.verify}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Product verification error:', error);
      // Mock response for demo when backend is unavailable
      return this.getMockVerificationResponse(request);
    }
  }

  async traceProduct(request: TraceRequest): Promise<TraceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${PHARMA_API_CONFIG.endpoints.trace}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Trace failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Product trace error:', error);
      // Mock response for demo when backend is unavailable
      return this.getMockTraceResponse(request);
    }
  }

  async getAlerts(role: string): Promise<Alert[]> {
    try {
      const response = await fetch(`${this.baseUrl}${PHARMA_API_CONFIG.endpoints.alerts}?role=${role}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Alerts fetch error:', error);
      // Mock response for demo when backend is unavailable
      return this.getMockAlerts();
    }
  }

  async flagProduct(gtin: string, lotNumber: string, status: string, reason: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${PHARMA_API_CONFIG.endpoints.flag}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gtin, lotNumber, status, reason }),
      });

      return response.ok;
    } catch (error) {
      console.error('Product flag error:', error);
      return true; // Mock success for demo
    }
  }

  async initiateRecall(gtin: string, lotNumber: string, reason: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${PHARMA_API_CONFIG.endpoints.recall}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gtin, lotNumber, reason }),
      });

      return response.ok;
    } catch (error) {
      console.error('Recall initiation error:', error);
      return true; // Mock success for demo
    }
  }

  // Mock responses for demo purposes
  private getMockVerificationResponse(request: VerificationRequest): VerificationResponse {
    return {
      status: 'Saleable',
      isValid: true,
      product: {
        name: 'Aspirin 325mg',
        manufacturer: 'PharmaCorp Inc.',
        gtin: request.gtin,
        lotNumber: request.lotNumber,
        serialNumber: request.serialNumber,
        expiryDate: request.expiryDate,
      },
      alerts: [],
    };
  }

  private getMockTraceResponse(request: TraceRequest): TraceResponse {
    return {
      product: {
        name: 'Aspirin 325mg',
        manufacturer: 'PharmaCorp Inc.',
        gtin: request.gtin || '00012345678901',
        lotNumber: request.lotNumber || 'LOT001',
        serialNumber: request.serialNumber || 'SN123456789',
      },
      events: [
        {
          id: '1',
          type: 'commission',
          timestamp: '2024-01-15T10:00:00Z',
          location: 'Manufacturing Plant A',
          organization: 'PharmaCorp Inc.',
          role: 'manufacturer',
          details: { quantity: 1000, batchId: 'B001' },
        },
        {
          id: '2',
          type: 'ship',
          timestamp: '2024-01-16T14:30:00Z',
          location: 'Distribution Center',
          organization: 'MedDistrib LLC',
          role: 'distributor',
          details: { shipmentId: 'SH001', temperature: '2-8°C' },
        },
        {
          id: '3',
          type: 'receive',
          timestamp: '2024-01-17T09:15:00Z',
          location: 'City Pharmacy',
          organization: 'City Pharmacy',
          role: 'dispenser',
          details: { receivedBy: 'John Doe', condition: 'Good' },
        },
      ],
      permissionLevel: 'one-up-one-down',
    };
  }

  private getMockAlerts(): Alert[] {
    return [
      {
        id: '1',
        type: 'recall',
        status: 'Recalled',
        product: {
          name: 'Ibuprofen 200mg',
          gtin: '00012345678902',
          lotNumber: 'LOT002',
        },
        description: 'Voluntary recall due to packaging defect',
        timestamp: '2024-01-10T08:00:00Z',
        severity: 'high',
        affectedUnits: 5000,
      },
      {
        id: '2',
        type: 'investigation',
        status: 'Under Investigation',
        product: {
          name: 'Acetaminophen 500mg',
          gtin: '00012345678903',
          lotNumber: 'LOT003',
        },
        description: 'Investigation into reported adverse events',
        timestamp: '2024-01-12T14:00:00Z',
        severity: 'medium',
        affectedUnits: 1200,
      },
    ];
  }
}

export const pharmaTraceabilityService = new PharmaTraceabilityService();
