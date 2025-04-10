
import { ComplianceReportButton } from "./ComplianceReportButton";

interface ComplianceReportGeneratorProps {
  drugId?: string;
  drugSgtin?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ComplianceReportGenerator(props: ComplianceReportGeneratorProps) {
  return <ComplianceReportButton {...props} />;
}
