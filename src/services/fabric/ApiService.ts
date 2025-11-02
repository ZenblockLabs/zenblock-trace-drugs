
import { supabase } from '@/integrations/supabase/client';

export interface ApiResponse<T> {
  data: T;
  error: Error | null;
}

export class ApiService {
  /**
   * Generic method to invoke Supabase Edge Functions
   */
  protected async invokeFunction<T>(
    functionName: string, 
    options: {
      body?: any;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Always provide a body; use minimal placeholder if none provided
      // This guarantees the edge function receives a JSON body
      const payload = options.body ?? { _noop: true };

      // Debug: log function invocation payload
      console.debug(`[ApiService] Invoking ${functionName} with body:`, payload);
      
      // Let supabase-js handle method (defaults to POST) and headers
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });
      
      if (error) {
        console.error(`Error in ${functionName}:`, error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      return { data, error: null } as ApiResponse<T>;
    } catch (err) {
      console.error(`API call to ${functionName} failed:`, err);
      return { 
        data: null as unknown as T, 
        error: err instanceof Error ? err : new Error(String(err)) 
      };
    }
  }
}
