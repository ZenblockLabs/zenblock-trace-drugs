
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

interface AuditReport {
  id: string;
  name: string;
  date: Date;
  type: string;
  status: string;
  findings: number;
}

interface ComplianceData {
  dscsa: {
    status: string;
    lastUpdated: Date;
    complianceRatio: number;
    violations: number;
    pendingResolutions: number;
  };
}

export const downloadAuditReport = (report: AuditReport, complianceData?: ComplianceData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(44, 82, 130);
  doc.text("Zenblock Labs", 105, 20, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Compliance Audit Report", 105, 30, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), "MMM d, yyyy HH:mm")}`, 105, 38, { align: "center" });

  // Status
  doc.setFontSize(14);
  if (report.status === "Passed") {
    doc.setTextColor(0, 128, 0);
    doc.text("PASSED", 105, 48, { align: "center" });
  } else {
    doc.setTextColor(220, 0, 0);
    doc.text("FAILED", 105, 48, { align: "center" });
  }

  // Report details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Report Details", 14, 62);

  doc.autoTable({
    startY: 67,
    head: [["Property", "Value"]],
    body: [
      ["Report Name", report.name],
      ["Report ID", report.id],
      ["Date", format(report.date, "MMMM d, yyyy")],
      ["Type", report.type],
      ["Status", report.status],
      ["Findings", String(report.findings)],
    ],
    theme: "striped",
    headStyles: { fillColor: [44, 82, 130] },
  });

  // Compliance summary if available
  if (complianceData) {
    doc.setFontSize(12);
    doc.text("DSCSA Compliance Summary", 14, doc.lastAutoTable.finalY + 15);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Metric", "Value"]],
      body: [
        ["Overall Status", complianceData.dscsa.status],
        ["Compliance Ratio", `${complianceData.dscsa.complianceRatio}%`],
        ["Violations", String(complianceData.dscsa.violations)],
        ["Pending Resolutions", String(complianceData.dscsa.pendingResolutions)],
        ["Last Updated", format(complianceData.dscsa.lastUpdated, "MMM d, yyyy")],
      ],
      theme: "striped",
      headStyles: { fillColor: [44, 82, 130] },
    });
  }

  // Footer
  const pageCount = doc.internal.pages ? doc.internal.pages.length - 1 : 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Zenblock Labs - Compliance Audit Report - Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  const ts = new Date().getTime();
  doc.save(`audit-report-${report.id}-${ts}.pdf`);
};
