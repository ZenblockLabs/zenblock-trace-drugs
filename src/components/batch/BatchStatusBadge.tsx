
import { Badge } from '@/components/ui/badge';

interface BatchStatusBadgeProps {
  status: string;
}

export const BatchStatusBadge = ({ status }: BatchStatusBadgeProps) => {
  const getStatusBadgeVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('ready') || lowerStatus.includes('dispatched') || lowerStatus.includes('dispensed')) {
      return 'default';
    } else if (lowerStatus.includes('transit') || lowerStatus.includes('production') || lowerStatus.includes('incoming')) {
      return 'secondary';
    } else if (lowerStatus.includes('review') || lowerStatus.includes('check')) {
      return 'outline';
    }
    return 'outline';
  };

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {status}
    </Badge>
  );
};
