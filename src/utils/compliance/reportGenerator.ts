
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Drug, TrackingEvent } from "@/services/types";
import { checkCompliance } from "./complianceChecker";

/**
 * Generates a PDF compliance report for a drug
 */
export const generatePDFReport = async (
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
  
  doc.autoTable({
    startY: 65,
    head: [["Property", "Value"]],
    body: drugInfo,
    theme: 'striped',
    headStyles: { fillColor: [44, 82, 130] },
  });
  
  // Recall status
  doc.setFontSize(12);
  doc.text("Recall Status", 14, doc.lastAutoTable.finalY + 15);
  
  const recallInfo = [
    ["Status", recallStatus.isRecalled ? "RECALLED" : "Not Recalled"],
  ];
  
  if (recallStatus.isRecalled) {
    recallInfo.push(["Reason", recallStatus.reason]);
  }
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
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
    doc.text("Compliance Issues", 14, doc.lastAutoTable.finalY + 15);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
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
  doc.text("Supply Chain Timeline", 14, doc.lastAutoTable.finalY + 15);
  
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
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Event", "Timestamp", "Handler", "Location", "Verified"]],
    body: eventRows,
    theme: 'striped',
    headStyles: { fillColor: [44, 82, 130] },
    styles: { fontSize: 8 },
  });
  
  // Footer with company information
  // Using a safer approach to get page count
  const pageCount = doc.internal.pages ? doc.internal.pages.length - 1 : 1;
  
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
  
  try {
    // Save the PDF with a unique name including timestamp to avoid browser caching issues
    const timestamp = new Date().getTime();
    doc.save(`compliance-report-${drug.sgtin}-${timestamp}.pdf`);
    return true;
  } catch (error) {
    console.error("Error saving PDF:", error);
    throw new Error("Failed to download PDF report");
  }
};
