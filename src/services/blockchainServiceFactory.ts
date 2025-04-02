
import { mockBlockchainService } from './mockBlockchainService';
import { FabricService, IFabricService } from './fabricService';

// Environment configuration
const USE_FABRIC = false; // Set to true when ready to use real Fabric network

// Singleton instance of the service
let serviceInstance: IFabricService | null = null;

export const getBlockchainService = async (): Promise<IFabricService> => {
  if (serviceInstance) {
    return serviceInstance;
  }

  if (USE_FABRIC) {
    try {
      const fabricService = new FabricService();
      const connected = await fabricService.connect();
      
      if (connected) {
        serviceInstance = fabricService;
        console.log('Using Hyperledger Fabric blockchain service');
        return fabricService;
      } else {
        console.warn('Failed to connect to Fabric network, falling back to mock service');
        serviceInstance = mockBlockchainService;
        return mockBlockchainService;
      }
    } catch (error) {
      console.error('Error initializing Fabric service:', error);
      console.warn('Falling back to mock blockchain service');
      serviceInstance = mockBlockchainService;
      return mockBlockchainService;
    }
  } else {
    console.log('Using mock blockchain service (development mode)');
    serviceInstance = mockBlockchainService;
    return mockBlockchainService;
  }
};
