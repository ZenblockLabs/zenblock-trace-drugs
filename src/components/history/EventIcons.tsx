
import { Package, ArrowUp, ArrowDown, Clock, AlertTriangle, ShieldCheck, Info } from "lucide-react";

export function getEventIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'commission':
      return <Package className="h-5 w-5 text-blue-500" />;
    case 'qa-passed':
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'ship':
      return <ArrowUp className="h-5 w-5 text-indigo-500" />;
    case 'receive':
      return <ArrowDown className="h-5 w-5 text-green-500" />;
    case 'recall':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'warehouse':
      return <Package className="h-5 w-5 text-purple-500" />;
    case 'dispense':
      return <Package className="h-5 w-5 text-teal-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
}

export function getEventColor(type: string) {
  switch (type.toLowerCase()) {
    case 'commission':
      return 'bg-blue-100 text-blue-800';
    case 'qa-passed':
      return 'bg-green-100 text-green-800';
    case 'ship':
      return 'bg-indigo-100 text-indigo-800';
    case 'receive':
      return 'bg-green-100 text-green-800';
    case 'recall':
      return 'bg-red-100 text-red-800';
    case 'warehouse':
      return 'bg-purple-100 text-purple-800';
    case 'dispense':
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
