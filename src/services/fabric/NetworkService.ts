
import { supabase } from '@/integrations/supabase/client';
import { ApiService } from './ApiService';

export class NetworkService extends ApiService {
  private gatewayConnected: boolean = false;
  
  /**
   * Connect to the Fabric network
   */
  async connect(): Promise<boolean> {
    try {
      // Check if the Fabric service is accessible via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('fabric-ping', {
        body: { action: 'ping' }
      });

      if (error) {
        console.error('Failed to connect to fabric service:', error);
        return false;
      }

      this.gatewayConnected = true;
      return true;
    } catch (err) {
      console.error('Error connecting to fabric service:', err);
      return false;
    }
  }
  
  /**
   * Check if connected to the Fabric network
   */
  isConnected(): boolean {
    return this.gatewayConnected;
  }
  
  /**
   * Ensure connection to the Fabric network
   */
  async ensureConnection(): Promise<boolean> {
    if (!this.gatewayConnected) {
      return this.connect();
    }
    return true;
  }
}
