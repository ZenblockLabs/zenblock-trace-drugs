
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DrugTraceability } from "@/services/types";

export function useDrugTracking(code: string | null) {
  const [data, setData] = useState<DrugTraceability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!code) {
        setError("No tracking code provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Using correctly formatted Supabase Edge Function invocation
        const { data: responseData, error: responseError } = await supabase.functions.invoke('track-drug', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          // Correct params format for Supabase function invocation
          params: { code }
        });

        if (responseError) {
          throw new Error(responseError.message);
        }

        setData(responseData);
      } catch (err) {
        console.error("Error fetching drug traceability data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch drug data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return { data, loading, error, formatDate };
}
