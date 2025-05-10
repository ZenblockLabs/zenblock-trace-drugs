
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DrugTraceability } from "@/services/types/TrackingTypes";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function useDrugTracking(code: string | null) {
  const [data, setData] = useState<DrugTraceability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!code) {
        setError("No tracking code provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Determine user role for filtering
        let role = null;
        if (user && user.email) {
          // Extract role from user email or user metadata
          if (user.email.includes('manufacturer')) {
            role = 'manufacturer';
          } else if (user.email.includes('distributor')) {
            role = 'distributor';
          } else if (user.email.includes('dispenser')) {
            role = 'dispenser';
          } else if (user.email.includes('regulator')) {
            role = 'regulator';
          }
        }
        
        setIsFiltered(role !== null && role !== 'regulator');
        
        console.log("Fetching drug data with code:", code, "role:", role);
        
        // Using correctly formatted Supabase Edge Function invocation
        const { data: responseData, error: responseError } = await supabase.functions.invoke('track-drug', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // Pass the code and role as body parameters
          body: { code, role }
        });

        console.log("Edge function response:", responseData, responseError);

        if (responseError) {
          console.error("Edge function error:", responseError);
          throw new Error(responseError.message || "Failed to fetch drug data");
        }

        if (!responseData) {
          throw new Error("No data returned from the server");
        }

        setData(responseData);
      } catch (err) {
        console.error("Error fetching drug traceability data:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch drug data";
        setError(errorMessage);
        toast.error("Error: " + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code, user]);

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
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  return { data, loading, error, formatDate, isFiltered };
}
