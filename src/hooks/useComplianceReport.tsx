
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
      if (drugId) {
        drug = await service.getDrugById(drugId);
      } else if (drugSgtin) {
        drug = await service.getDrugBySGTIN(drugSgtin);
      }
      
      if (!drug) {
        throw new Error("Drug not found");
      }
      
      // Fetch all events for this drug - using the regulator role to get unfiltered data
      const events = await service.getEventsByDrug(drug.id);
      
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
        description: "Failed to generate compliance report",
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
