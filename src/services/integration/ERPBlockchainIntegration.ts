import { ERPService, ERPOrder } from '../erp/ERPService';
import { getBlockchainService } from '../blockchainServiceFactory';
import { mockERPService } from '../erp/MockERPService';

export interface IntegrationEvent {
  id: string;
  type: 'order_created' | 'order_shipped' | 'inventory_updated' | 'drug_transferred';
  source: 'erp' | 'blockchain';
  timestamp: string;
  data: any;
  status: 'pending' | 'processed' | 'failed';
}

export class ERPBlockchainIntegration {
  private erpService: ERPService;
  private events: IntegrationEvent[] = [];

  constructor(erpService: ERPService = mockERPService) {
    this.erpService = erpService;
  }

  async syncOrderToBlockchain(orderId: string): Promise<boolean> {
    try {
      console.log(`Syncing order ${orderId} to blockchain...`);
      
      const order = await this.erpService.getOrder(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      const blockchainService = await getBlockchainService();
      
      // Create blockchain events for order items
      for (const item of order.items) {
        if (item.batchId) {
          await blockchainService.createEvent({
            drugId: item.drugId,
            eventType: 'order_created',
            actorId: 'erp-system',
            actorName: 'ERP System',
            actorRole: 'system',
            location: 'ERP Database',
            details: {
              orderId: order.id,
              customerName: order.customerName,
              quantity: item.quantity,
              batchId: item.batchId
            }
          });
        }
      }

      this.addEvent({
        type: 'order_created',
        source: 'erp',
        data: order,
        status: 'processed'
      });

      return true;
    } catch (error) {
      console.error('Error syncing order to blockchain:', error);
      this.addEvent({
        type: 'order_created',
        source: 'erp',
        data: { orderId, error: error.message },
        status: 'failed'
      });
      return false;
    }
  }

  async syncShipmentToBlockchain(orderId: string): Promise<boolean> {
    try {
      console.log(`Syncing shipment ${orderId} to blockchain...`);
      
      const order = await this.erpService.getOrder(orderId);
      if (!order || order.status !== 'shipped') {
        throw new Error(`Order ${orderId} not found or not shipped`);
      }

      const blockchainService = await getBlockchainService();
      
      // Create shipment events for order items
      for (const item of order.items) {
        if (item.batchId) {
          await blockchainService.createEvent({
            drugId: item.drugId,
            eventType: 'shipped',
            actorId: 'erp-system',
            actorName: 'ERP System',
            actorRole: 'distributor',
            location: 'Distribution Center',
            details: {
              orderId: order.id,
              customerName: order.customerName,
              quantity: item.quantity,
              batchId: item.batchId,
              shippedAt: new Date().toISOString()
            }
          });
        }
      }

      this.addEvent({
        type: 'order_shipped',
        source: 'erp',
        data: order,
        status: 'processed'
      });

      return true;
    } catch (error) {
      console.error('Error syncing shipment to blockchain:', error);
      return false;
    }
  }

  async syncInventoryUpdate(drugId: string, batchId: string, newQuantity: number): Promise<boolean> {
    try {
      console.log(`Syncing inventory update for ${drugId}/${batchId} to blockchain...`);
      
      const blockchainService = await getBlockchainService();
      
      await blockchainService.createEvent({
        drugId: drugId,
        eventType: 'inventory_updated',
        actorId: 'erp-system',
        actorName: 'ERP System',
        actorRole: 'system',
        location: 'Warehouse',
        details: {
          batchId: batchId,
          newQuantity: newQuantity,
          updatedAt: new Date().toISOString()
        }
      });

      this.addEvent({
        type: 'inventory_updated',
        source: 'erp',
        data: { drugId, batchId, newQuantity },
        status: 'processed'
      });

      return true;
    } catch (error) {
      console.error('Error syncing inventory update to blockchain:', error);
      return false;
    }
  }

  private addEvent(eventData: Omit<IntegrationEvent, 'id' | 'timestamp'>): void {
    const event: IntegrationEvent = {
      ...eventData,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    this.events.push(event);
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  getIntegrationEvents(): IntegrationEvent[] {
    return [...this.events];
  }

  async getERPOrders(): Promise<ERPOrder[]> {
    return this.erpService.getOrders();
  }
}

export const erpBlockchainIntegration = new ERPBlockchainIntegration();
