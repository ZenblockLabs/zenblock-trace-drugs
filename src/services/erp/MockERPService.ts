
import { ERPService, ERPOrder, ERPOrderItem, ERPInventoryItem, ERPSupplier } from './ERPService';

export class MockERPService extends ERPService {
  private orders: ERPOrder[] = [];
  private inventory: ERPInventoryItem[] = [];
  private suppliers: ERPSupplier[] = [];

  constructor() {
    super();
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize mock orders
    this.orders = [
      {
        id: 'ORD-001',
        customerName: 'City Hospital',
        items: [
          {
            drugId: 'drug-001',
            drugName: 'Aspirin 100mg',
            quantity: 1000,
            batchId: 'BATCH-ASP-2024-001',
            unitPrice: 0.15
          }
        ],
        status: 'processing',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        totalAmount: 150
      },
      {
        id: 'ORD-002',
        customerName: 'Metro Pharmacy',
        items: [
          {
            drugId: 'drug-002',
            drugName: 'Ibuprofen 200mg',
            quantity: 500,
            unitPrice: 0.25
          }
        ],
        status: 'shipped',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        totalAmount: 125
      }
    ];

    // Initialize mock inventory
    this.inventory = [
      {
        drugId: 'drug-001',
        drugName: 'Aspirin 100mg',
        batchId: 'BATCH-ASP-2024-001',
        quantity: 5000,
        location: 'Warehouse A - Section 1',
        expiryDate: '2026-12-31',
        cost: 0.10
      },
      {
        drugId: 'drug-002',
        drugName: 'Ibuprofen 200mg',
        batchId: 'BATCH-IBU-2024-001',
        quantity: 3000,
        location: 'Warehouse A - Section 2',
        expiryDate: '2025-08-15',
        cost: 0.18
      },
      {
        drugId: 'drug-003',
        drugName: 'Paracetamol 500mg',
        batchId: 'BATCH-PAR-2024-001',
        quantity: 8000,
        location: 'Warehouse B - Section 1',
        expiryDate: '2025-10-30',
        cost: 0.12
      }
    ];

    // Initialize mock suppliers
    this.suppliers = [
      {
        id: 'SUP-001',
        name: 'PharmaCorp Industries',
        contactInfo: 'contact@pharmacorp.com',
        drugs: ['drug-001', 'drug-003'],
        rating: 4.8
      },
      {
        id: 'SUP-002',
        name: 'MediSupply Ltd',
        contactInfo: 'orders@medisupply.com',
        drugs: ['drug-002'],
        rating: 4.5
      }
    ];
  }

  async getOrders(): Promise<ERPOrder[]> {
    console.log('MockERP: Fetching all orders');
    return [...this.orders];
  }

  async getOrder(orderId: string): Promise<ERPOrder | null> {
    console.log(`MockERP: Fetching order ${orderId}`);
    return this.orders.find(order => order.id === orderId) || null;
  }

  async createOrder(orderData: Omit<ERPOrder, 'id' | 'createdAt'>): Promise<ERPOrder> {
    console.log('MockERP: Creating new order', orderData);
    
    const newOrder: ERPOrder = {
      ...orderData,
      id: `ORD-${String(this.orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: ERPOrder['status']): Promise<boolean> {
    console.log(`MockERP: Updating order ${orderId} status to ${status}`);
    
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      return true;
    }
    return false;
  }

  async getInventory(): Promise<ERPInventoryItem[]> {
    console.log('MockERP: Fetching all inventory');
    return [...this.inventory];
  }

  async getInventoryByDrug(drugId: string): Promise<ERPInventoryItem[]> {
    console.log(`MockERP: Fetching inventory for drug ${drugId}`);
    return this.inventory.filter(item => item.drugId === drugId);
  }

  async updateInventory(drugId: string, batchId: string, quantity: number): Promise<boolean> {
    console.log(`MockERP: Updating inventory for ${drugId}/${batchId} to ${quantity}`);
    
    const item = this.inventory.find(i => i.drugId === drugId && i.batchId === batchId);
    if (item) {
      item.quantity = quantity;
      return true;
    }
    return false;
  }

  async getSuppliers(): Promise<ERPSupplier[]> {
    console.log('MockERP: Fetching all suppliers');
    return [...this.suppliers];
  }

  async getSupplier(supplierId: string): Promise<ERPSupplier | null> {
    console.log(`MockERP: Fetching supplier ${supplierId}`);
    return this.suppliers.find(supplier => supplier.id === supplierId) || null;
  }

  // Additional mock methods for simulation
  async simulateOrderProcessing(orderId: string): Promise<void> {
    console.log(`MockERP: Simulating order processing for ${orderId}`);
    
    const order = await this.getOrder(orderId);
    if (!order) return;

    // Simulate processing stages
    await this.updateOrderStatus(orderId, 'processing');
    
    // Update inventory for ordered items
    for (const item of order.items) {
      if (item.batchId) {
        const inventoryItem = this.inventory.find(
          inv => inv.drugId === item.drugId && inv.batchId === item.batchId
        );
        if (inventoryItem && inventoryItem.quantity >= item.quantity) {
          inventoryItem.quantity -= item.quantity;
        }
      }
    }

    setTimeout(async () => {
      await this.updateOrderStatus(orderId, 'shipped');
    }, 5000); // Simulate 5 second processing time
  }
}

export const mockERPService = new MockERPService();
