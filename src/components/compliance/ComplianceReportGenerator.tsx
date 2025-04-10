
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug, TrackingEvent } from "@/services/types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ComplianceReportGeneratorProps {
  drugId?: string;
  drugSgtin?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ComplianceReportGenerator({
  drugId,
  drugSgtin,
  buttonVariant = "default",
  buttonSize = "default",
  className
}: ComplianceReportGeneratorProps) {
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

  const checkCompliance = (events: TrackingEvent[]): string[] => {
    const issues: string[] = [];
    
    // Check if there are any events
    if (events.length === 0) {
      issues.push("No events recorded for this drug");
      return issues;
    }
    
    // Sort events by timestamp
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Required event types in proper order
    const requiredSequence = ['commission', 'ship', 'receive', 'dispense'];
    let foundEvents = new Set<string>();
    
    // Check for required events
    sortedEvents.forEach(event => {
      foundEvents.add(event.type.toLowerCase());
    });
    
    requiredSequence.forEach(required => {
      if (!foundEvents.has(required)) {
        issues.push(`Missing required event: ${required}`);
      }
    });
    
    // Check for logical flow (manufacturers → distributors → dispensers)
    let currentRole = "manufacturer";
    const roleOrder = ["manufacturer", "distributor", "dispenser"];
    
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const actorRole = typeof event.actor === 'string' 
        ? 'unknown' 
        : event.actor.role.toLowerCase();
      
      if (actorRole === 'regulator') continue; // Regulators can interact at any point
      
      const roleIndex = roleOrder.indexOf(actorRole);
      const currentRoleIndex = roleOrder.indexOf(currentRole);
      
      if (roleIndex < currentRoleIndex) {
        issues.push(`Invalid flow: ${actorRole} acted after ${currentRole} (Event: ${event.type})`);
      } else if (roleIndex > currentRoleIndex) {
        currentRole = actorRole;
      }
    }
    
    // Check for timeline gaps (more than 72 hours between events)
    const maxGapHours = 72;
    for (let i = 1; i < sortedEvents.length; i++) {
      const prevTime = new Date(sortedEvents[i-1].timestamp).getTime();
      const currTime = new Date(sortedEvents[i].timestamp).getTime();
      const diffHours = (currTime - prevTime) / (1000 * 60 * 60);
      
      if (diffHours > maxGapHours) {
        issues.push(`Timeline gap of ${Math.round(diffHours)} hours between events`);
      }
    }
    
    return issues;
  };

  const generatePDFReport = async (
    drug: Drug, 
    events: TrackingEvent[], 
    recallStatus: { isRecalled: boolean; reason: string },
    isCompliant: boolean,
    complianceIssues: string[]
  ) => {
    const doc = new jsPDF();
    
    // Add Zenblock Labs branding
    doc.setFontSize(22);
    doc.setTextColor(44, 82, 130);
    doc.text("Zenblock Labs", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Drug Compliance Traceability Report", 105, 30, { align: "center" });
    
    // Report timestamp
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated on: ${timestamp}`, 105, 38, { align: "center" });
    
    // Compliance verdict
    doc.setFontSize(14);
    if (isCompliant) {
      doc.setTextColor(0, 128, 0); // Green
      doc.text("✅ COMPLIANT", 105, 46, { align: "center" });
    } else {
      doc.setTextColor(220, 0, 0); // Red
      doc.text("❌ VIOLATIONS FOUND", 105, 46, { align: "center" });
    }
    
    // Drug information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Drug Information", 14, 60);
    
    const drugInfo = [
      ["Product Name", drug.productName || drug.name],
      ["Manufacturer", drug.manufacturerName || drug.manufacturer],
      ["SGTIN", drug.sgtin],
      ["Batch Number", drug.batchNumber],
      ["Expiry Date", drug.expiryDate],
      ["License Number", drug.licenseNumber || "N/A"],
    ];
    
    (doc as any).autoTable({
      startY: 65,
      head: [["Property", "Value"]],
      body: drugInfo,
      theme: 'striped',
      headStyles: { fillColor: [44, 82, 130] },
    });
    
    // Recall status
    doc.setFontSize(12);
    doc.text("Recall Status", 14, (doc as any).lastAutoTable.finalY + 15);
    
    const recallInfo = [
      ["Status", recallStatus.isRecalled ? "RECALLED" : "Not Recalled"],
    ];
    
    if (recallStatus.isRecalled) {
      recallInfo.push(["Reason", recallStatus.reason]);
    }
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 20,
      body: recallInfo,
      theme: 'plain',
      styles: { 
        cellPadding: 5,
        fontSize: 10
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 }
      }
    });
    
    // Compliance issues (if any)
    if (complianceIssues.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(220, 0, 0);
      doc.text("Compliance Issues", 14, (doc as any).lastAutoTable.finalY + 15);
      
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 20,
        body: complianceIssues.map(issue => [issue]),
        theme: 'plain',
        styles: { 
          cellPadding: 5,
          fontSize: 10,
          textColor: [220, 0, 0]
        }
      });
    }
    
    // Event timeline
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Supply Chain Timeline", 14, (doc as any).lastAutoTable.finalY + 15);
    
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const eventRows = sortedEvents.map(event => {
      const actor = typeof event.actor === 'string' 
        ? event.actor 
        : `${event.actor.name} (${event.actor.role})`;
      
      const verified = event.details?.isOnChain ? "✓" : "";
      
      return [
        event.type.charAt(0).toUpperCase() + event.type.slice(1),
        new Date(event.timestamp).toLocaleString(),
        actor,
        event.location || "Unknown",
        verified
      ];
    });
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Event", "Timestamp", "Handler", "Location", "Verified"]],
      body: eventRows,
      theme: 'striped',
      headStyles: { fillColor: [44, 82, 130] },
      styles: { fontSize: 8 },
    });
    
    // Footer with company information
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Zenblock Labs - Pharma Supply Chain Traceability - Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Save the PDF
    doc.save(`compliance-report-${drug.sgtin}.pdf`);
  };

  return (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      className={className}
      onClick={generateReport}
      disabled={isGenerating || (!drugId && !drugSgtin)}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Generate Compliance Report
        </>
      )}
    </Button>
  );
}
