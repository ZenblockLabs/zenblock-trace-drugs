
import { mockBlockchainService } from './mockBlockchainService';
import { FabricService, IFabricService } from './fabricService';
import { toast } from '@/hooks/use-toast';

// Environment configuration (can be changed at runtime)
let USE_FABRIC = true; // Set to true when ready to use real Fabric network

// Singleton instance of the service
let serviceInstance: IFabricService | null = null;

// To allow resetting the service when toggling between real and mock
export const resetBlockchainService = () => {
  serviceInstance = null;
  console.log('Blockchain service reset');
};

// Update the USE_FABRIC flag
export const setUseFabric = (useFabric: boolean) => {
  if (USE_FABRIC !== useFabric) {
    USE_FABRIC = useFabric;
    resetBlockchainService();
    console.log(`Switched to ${useFabric ? 'Fabric' : 'Mock'} blockchain service`);
  }
};

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
        toast({
          title: "Network Connection Failed",
          description: "Using mock blockchain service due to connection issues.",
          variant: "destructive",
        });
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

// Check if we're using the mock service or real Fabric
export const isUsingMockService = async (): Promise<boolean> => {
  const service = await getBlockchainService();
  return service === mockBlockchainService;
};

// Get current configuration
export const getBlockchainConfig = () => {
  return {
    useFabric: USE_FABRIC
  };
};
