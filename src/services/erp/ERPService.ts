
export interface ERPOrder {
  id: string;
  customerName: string;
  items: ERPOrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  totalAmount: number;
}

export interface ERPOrderItem {
  drugId: string;
  drugName: string;
  quantity: number;
  batchId?: string;
  unitPrice: number;
}

export interface ERPInventoryItem {
  drugId: string;
  drugName: string;
  batchId: string;
  quantity: number;
  location: string;
  expiryDate: string;
  cost: number;
}

export interface ERPSupplier {
  id: string;
  name: string;
  contactInfo: string;
  drugs: string[];
  rating: number;
}

export abstract class ERPService {
  abstract getOrders(): Promise<ERPOrder[]>;
  abstract getOrder(orderId: string): Promise<ERPOrder | null>;
  abstract createOrder(order: Omit<ERPOrder, 'id' | 'createdAt'>): Promise<ERPOrder>;
  abstract updateOrderStatus(orderId: string, status: ERPOrder['status']): Promise<boolean>;
  
  abstract getInventory(): Promise<ERPInventoryItem[]>;
  abstract getInventoryByDrug(drugId: string): Promise<ERPInventoryItem[]>;
  abstract updateInventory(drugId: string, batchId: string, quantity: number): Promise<boolean>;
  
  abstract getSuppliers(): Promise<ERPSupplier[]>;
  abstract getSupplier(supplierId: string): Promise<ERPSupplier | null>;
}
