
export interface FabricNetworkConfig {
  networkName: string;
  channelName: string;
  chaincodeName: string;
  mspId: string;
  gatewayPeer: string;
  connectionProfile: {
    name: string;
    version: string;
    client: {
      organization: string;
      connection: {
        timeout: {
          peer: {
            endorser: string;
          };
        };
      };
    };
    organizations: Record<string, any>;
    orderers: Record<string, any>;
    peers: Record<string, any>;
    certificateAuthorities: Record<string, any>;
  };
  credentials: {
    certificate: string;
    privateKey: string;
  };
}

export class FabricNetworkConfigService {
  private config: FabricNetworkConfig | null = null;

  async loadConfig(): Promise<FabricNetworkConfig> {
    // In a real implementation, this would load from environment variables or config files
    // For now, we'll return a mock configuration structure
    this.config = {
      networkName: "pharma-network",
      channelName: "pharma-channel",
      chaincodeName: "drug-traceability",
      mspId: "Org1MSP",
      gatewayPeer: "peer0.org1.pharma.com",
      connectionProfile: {
        name: "pharma-network",
        version: "1.0.0",
        client: {
          organization: "Org1",
          connection: {
            timeout: {
              peer: {
                endorser: "300"
              }
            }
          }
        },
        organizations: {},
        orderers: {},
        peers: {},
        certificateAuthorities: {}
      },
      credentials: {
        certificate: import.meta.env.VITE_FABRIC_USER_CERT || "",
        privateKey: import.meta.env.VITE_FABRIC_USER_KEY || ""
      }
    };

    return this.config;
  }

  getConfig(): FabricNetworkConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return this.config !== null && 
           this.config.credentials.certificate !== "" && 
           this.config.credentials.privateKey !== "";
  }
}

export const fabricNetworkConfig = new FabricNetworkConfigService();
