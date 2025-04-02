
import { DrugStatus } from "@/services/mockBlockchainService";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: DrugStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span 
      className={cn("status-badge", status, className)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')}
    </span>
  );
};
