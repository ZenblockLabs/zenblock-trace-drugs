
import { DrugStatus } from "@/services/mockBlockchainService";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: DrugStatus;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge = ({ status, className, size = "md" }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };
  
  return (
    <span 
      className={cn(
        "status-badge rounded-full font-medium", 
        status, 
        sizeClasses[size],
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')}
    </span>
  );
};
