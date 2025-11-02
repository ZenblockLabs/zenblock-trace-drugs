
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
      method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Ensure body is always defined (use empty object if undefined)
      // This prevents the Supabase client from not sending a body at all
      const requestBody = options.body !== undefined ? options.body : {};
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        body: requestBody
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
