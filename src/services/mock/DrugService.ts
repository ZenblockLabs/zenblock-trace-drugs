
import { Drug } from '../types';
import { mockDrugs, computeDrugStatus } from '../mockData';

export class MockDrugService {
  private drugs: Drug[] = [];

  constructor() {
    this.initializeDrugs();
  }

  private initializeDrugs() {
    // Initialize drugs with computed statuses
    this.drugs = mockDrugs.map(drug => {
      const { status, currentOwnerId, currentOwnerName, currentOwnerRole } = 
        computeDrugStatus(drug.id);
      
      return {
        ...drug,
        status,
        currentOwnerId,
        currentOwnerName, 
        currentOwnerRole
      };
    });
  }

  async registerDrug(drugData: Omit<Drug, 'id'>): Promise<Drug> {
    const newDrug: Drug = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      ...drugData
    };
    this.drugs.push(newDrug);
    return newDrug;
  }

  async getAllDrugs(): Promise<Drug[]> {
    return this.drugs;
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    return this.drugs.filter(drug => drug.currentOwnerId === ownerId);
  }

  async getDrugById(id: string): Promise<Drug | null> {
    return this.drugs.find(drug => drug.id === id) || null;
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    return this.drugs.find(drug => drug.sgtin === sgtin) || null;
  }

  // Update a drug in the collection
  updateDrug(updatedDrug: Drug): void {
    const index = this.drugs.findIndex(drug => drug.id === updatedDrug.id);
    if (index !== -1) {
      this.drugs[index] = updatedDrug;
    }
  }
}
