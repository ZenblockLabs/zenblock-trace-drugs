
// Pharma Traceability API Configuration
export const PHARMA_API_CONFIG = {
  baseUrl: process.env.REACT_APP_PHARMA_API_URL || 'http://localhost:3000',
  endpoints: {
    verify: '/verify',
    trace: '/trace',
    flag: '/flag',
    recall: '/recall',
    alerts: '/alerts',
    commission: '/commission',
    ship: '/ship',
    receive: '/receive',
    dispense: '/dispense'
  }
};

// Demo roles for role switching
export const DEMO_ROLES = [
  'manufacturer',
  'distributor',
  'dispenser',
  'quality_analyst',
  'serialization_analyst'
] as const;

export type DemoRole = typeof DEMO_ROLES[number];

// Product status types
export const PRODUCT_STATUS = {
  SALEABLE: 'Saleable',
  UNDER_EVALUATION: 'Under Evaluation',
  UNDER_INVESTIGATION: 'Under Investigation',
  RECALLED: 'Recalled'
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];
