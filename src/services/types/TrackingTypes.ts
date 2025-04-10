
import { Drug, TrackingEvent } from '../types';

// Define richer event details for visualization
export interface EnhancedTrackingEvent extends TrackingEvent {
  enhancedData?: {
    temperature?: Array<{timestamp: string; temperature: number; unit: string}>;
    blockchain?: {
      verified: boolean;
      hash?: string;
      blockHeight?: number;
      timestamp?: string;
    };
    location?: {
      coordinates?: string;
      formattedAddress: string;
    };
    humidity?: number | null;
    shockEvents?: Array<{timestamp: string; gForce: number; location: string}>;
  };
}

// Specific format for the public tracking interface
export interface DrugTraceability {
  drug: {
    name: string;
    manufacturer: string;
    batchId: string;
    expiry: string;
    license: string;
    sgtin: string;
  };
  events: Array<{
    step: string;
    timestamp: string;
    location: string;
    handler: string;
    notes: string;
  }>;
  status: {
    isRecalled: boolean;
    message: string;
    verifiedBy: string;
  };
}
