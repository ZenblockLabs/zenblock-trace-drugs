
export interface OrganizationConfig {
  name: string;
  mspId: string;
  peers: string[];
  ca: string;
  adminCert?: string;
  adminKey?: string;
}

export interface ChannelConfig {
  name: string;
  orderers: string[];
  peers: string[];
}

export interface NetworkConfig {
  name: string;
  organizations: Record<string, OrganizationConfig>;
  orderers: Record<string, string>;
  channels: Record<string, ChannelConfig>;
  chaincode: {
    name: string;
    version: string;
    path: string;
  };
}

export interface FabricCredentials {
  userId: string;
  userCert: string;
  userKey: string;
  mspId: string;
}

export class FabricConfigService {
  private static instance: FabricConfigService;
  private config: NetworkConfig | null = null;
  private credentials: FabricCredentials | null = null;

  private constructor() {}

  static getInstance(): FabricConfigService {
    if (!FabricConfigService.instance) {
      FabricConfigService.instance = new FabricConfigService();
    }
    return FabricConfigService.instance;
  }

  async loadNetworkConfig(): Promise<NetworkConfig> {
    // In production, this would load from environment variables or secure storage
    this.config = {
      name: "pharma-network",
      organizations: {
        manufacturer: {
          name: "ManufacturerOrg",
          mspId: "ManufacturerMSP",
          peers: ["peer0.manufacturer.pharma.com:7051"],
          ca: "ca.manufacturer.pharma.com:7054"
        },
        distributor: {
          name: "DistributorOrg", 
          mspId: "DistributorMSP",
          peers: ["peer0.distributor.pharma.com:8051"],
          ca: "ca.distributor.pharma.com:8054"
        },
        dispenser: {
          name: "DispenserOrg",
          mspId: "DispenserMSP", 
          peers: ["peer0.dispenser.pharma.com:9051"],
          ca: "ca.dispenser.pharma.com:9054"
        },
        regulator: {
          name: "RegulatorOrg",
          mspId: "RegulatorMSP",
          peers: ["peer0.regulator.pharma.com:10051"],
          ca: "ca.regulator.pharma.com:10054"
        }
      },
      orderers: {
        "orderer.pharma.com": "orderer.pharma.com:7050"
      },
      channels: {
        "pharma-channel": {
          name: "pharma-channel",
          orderers: ["orderer.pharma.com:7050"],
          peers: [
            "peer0.manufacturer.pharma.com:7051",
            "peer0.distributor.pharma.com:8051", 
            "peer0.dispenser.pharma.com:9051",
            "peer0.regulator.pharma.com:10051"
          ]
        }
      },
      chaincode: {
        name: "drug-traceability",
        version: "1.0",
        path: "github.com/pharma/chaincode"
      }
    };

    return this.config;
  }

  getNetworkConfig(): NetworkConfig | null {
    return this.config;
  }

  setCredentials(credentials: FabricCredentials): void {
    this.credentials = credentials;
  }

  getCredentials(): FabricCredentials | null {
    return this.credentials;
  }

  getOrganizationByMSP(mspId: string): OrganizationConfig | null {
    if (!this.config) return null;
    
    return Object.values(this.config.organizations).find(org => org.mspId === mspId) || null;
  }

  isConfigured(): boolean {
    return this.config !== null && this.credentials !== null;
  }

  validateConfig(): string[] {
    const errors: string[] = [];
    
    if (!this.config) {
      errors.push("Network configuration not loaded");
      return errors;
    }

    if (Object.keys(this.config.organizations).length === 0) {
      errors.push("No organizations configured");
    }

    if (Object.keys(this.config.orderers).length === 0) {
      errors.push("No orderers configured");
    }

    if (!this.credentials) {
      errors.push("User credentials not set");
    }

    return errors;
  }
}

export const fabricConfig = FabricConfigService.getInstance();
