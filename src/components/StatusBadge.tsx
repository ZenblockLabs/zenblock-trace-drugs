
import { cn } from "@/lib/utils";
import { DrugStatus } from "@/services/mockBlockchainService";

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
  
  const statusClasses = {
    'manufactured': 'bg-blue-100 text-blue-800 border-blue-200',
    'shipped': 'bg-amber-100 text-amber-800 border-amber-200',
    'in-transit': 'bg-purple-100 text-purple-800 border-purple-200',
    'received': 'bg-green-100 text-green-800 border-green-200',
    'dispensed': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'recalled': 'bg-red-100 text-red-800 border-red-200',
  };
  
  return (
    <span 
      className={cn(
        "status-badge rounded-full font-medium border", 
        statusClasses[status], 
        sizeClasses[size],
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')}
    </span>
  );
};
