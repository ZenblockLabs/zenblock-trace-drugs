
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug } from "@/services/types";
import { checkCompliance } from "@/utils/compliance/complianceChecker";
import { generatePDFReport } from "@/utils/compliance/reportGenerator";

interface UseComplianceReportProps {
  drugId?: string;
  drugSgtin?: string;
}

export function useComplianceReport({ drugId, drugSgtin }: UseComplianceReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateReport = async () => {
    if (!drugId && !drugSgtin) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Drug ID or SGTIN is required to generate a report",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const service = await getBlockchainService(user?.email);
      
      // Fetch drug data
      let drug: Drug | null = null;
      
      // First try to get drug by ID if provided
      if (drugId) {
        try {
          drug = await service.getDrugById(drugId);
        } catch (error) {
          console.log("Failed to get drug by ID, trying SGTIN next:", error);
        }
      }
      
      // If drug not found by ID or no ID provided, try SGTIN
      if (!drug && drugSgtin) {
        try {
          drug = await service.getDrugBySGTIN(drugSgtin);
        } catch (error) {
          console.log("Failed to get drug by SGTIN:", error);
        }
      }
      
      if (!drug) {
        throw new Error(`Drug not found with ${drugId ? `ID: ${drugId}` : ''} ${drugSgtin ? `SGTIN: ${drugSgtin}` : ''}`);
      }
      
      console.log("Found drug for report:", drug);
      
      // Fetch all events for this drug - using the regulator role to get unfiltered data
      const events = await service.getEventsByDrug(drug.id);
      console.log(`Retrieved ${events.length} events for drug ${drug.id}`);
      
      // Check the recall status
      const recallStatus = await service.checkRecallStatus(drug.sgtin);
      
      // Check compliance
      const complianceIssues = checkCompliance(events);
      const isCompliant = complianceIssues.length === 0;
      
      // Generate the PDF report
      await generatePDFReport(drug, events, recallStatus, isCompliant, complianceIssues);

      toast({
        title: "Report generated",
        description: "Your compliance report has been downloaded",
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate compliance report: " + (error instanceof Error ? error.message : "Unknown error"),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReport
  };
}
