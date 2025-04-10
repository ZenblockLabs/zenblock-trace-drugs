
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useComplianceReport } from "@/hooks/useComplianceReport";

interface ComplianceReportButtonProps {
  drugId?: string;
  drugSgtin?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export function ComplianceReportButton({
  drugId,
  drugSgtin,
  variant = "default",
  size = "default",
  className,
  disabled: externalDisabled
}: ComplianceReportButtonProps) {
  const { isGenerating, generateReport } = useComplianceReport({ drugId, drugSgtin });

  // Button is disabled if explicitly set from outside, or if generating,
  // or if neither drug ID nor SGTIN provided
  const isDisabled = externalDisabled || isGenerating || (!drugId && !drugSgtin);

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={generateReport}
      disabled={isDisabled}
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
