
import { useState, useEffect } from "react";
import { TrackingEvent, Drug } from "@/services/types";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { checkCompliance } from "@/utils/compliance/complianceChecker";
import { determineComplianceStatus, ComplianceStatus } from "@/utils/compliance/statusUtils";
import { useAuth } from "@/context/AuthContext";

export function useTraceabilityData(drugId?: string) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus>("compliant");
  const [complianceIssues, setComplianceIssues] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      if (!drugId) return;
      
      try {
        setLoading(true);
        const service = await getBlockchainService(user?.email);
        
        const drugData = await service.getDrugById(drugId);
        setDrug(drugData);
        
        // Fetch all events for this drug (unfiltered)
        const allEvents = await service.getEventsByDrug(drugId);
        
        // Sort events by timestamp (oldest first for timeline)
        const sortedEvents = [...allEvents].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setEvents(sortedEvents);
        
        // Check compliance
        const issues = checkCompliance(sortedEvents);
        setComplianceIssues(issues);
        setComplianceStatus(determineComplianceStatus(issues));
      } catch (error) {
        console.error("Failed to load traceability timeline:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [drugId, user?.email]);

  return {
    events,
    drug,
    loading,
    complianceStatus,
    complianceIssues
  };
}
