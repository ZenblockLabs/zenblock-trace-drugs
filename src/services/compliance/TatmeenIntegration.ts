
import { Drug, TrackingEvent } from '@/services/types';

export interface TatmeenExportData {
  serialNumber: string;
  gtin: string;
  batchNumber: string;
  expiryDate: string;
  manufacturerGLN: string;
  events: TatmeenEvent[];
}

export interface TatmeenEvent {
  eventType: string;
  timestamp: string;
  location: string;
  actorGLN: string;
  eventId: string;
}

export class TatmeenIntegration {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string = 'https://api.tatmeen.ae/v1', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Export drug data to Tatmeen in GS1 XML format
   */
  async exportToTatmeen(drug: Drug, events: TrackingEvent[]): Promise<boolean> {
    try {
      const exportData = this.prepareExportData(drug, events);
      const gs1Xml = this.generateGS1XML(exportData);
      
      const response = await fetch(`${this.baseUrl}/drugs/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Source-System': 'ZBL-Blockchain'
        },
        body: gs1Xml
      });

      if (!response.ok) {
        throw new Error(`Tatmeen export failed: ${response.statusText}`);
      }

      console.log('Successfully exported to Tatmeen:', drug.sgtin);
      return true;
    } catch (error) {
      console.error('Tatmeen export error:', error);
      return false;
    }
  }

  /**
   * Query Tatmeen for drug status
   */
  async queryTatmeenStatus(sgtin: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/drugs/${sgtin}/status`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Tatmeen query failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Tatmeen query error:', error);
      return null;
    }
  }

  private prepareExportData(drug: Drug, events: TrackingEvent[]): TatmeenExportData {
    return {
      serialNumber: drug.sgtin || '',
      gtin: drug.gtin || '',
      batchNumber: drug.batchNumber || '',
      expiryDate: drug.expiryDate || '',
      manufacturerGLN: this.getManufacturerGLN(drug.manufacturerId || ''),
      events: events.map(event => ({
        eventType: this.mapEventTypeToTatmeen(event.type),
        timestamp: event.timestamp,
        location: event.location || '',
        actorGLN: this.getActorGLN(typeof event.actor === 'string' ? event.actor : event.actor.id),
        eventId: event.id
      }))
    };
  }

  private generateGS1XML(data: TatmeenExportData): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<epcis:EPCISDocument xmlns:epcis="urn:epcglobal:epcis:xsd:2" 
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <EPCISBody>
    <EventList>
      ${data.events.map(event => `
      <ObjectEvent>
        <eventTime>${event.timestamp}</eventTime>
        <eventTimeZoneOffset>+00:00</eventTimeZoneOffset>
        <epcList>
          <epc>urn:epc:id:sgtin:${data.gtin}.${data.serialNumber}</epc>
        </epcList>
        <action>OBSERVE</action>
        <bizStep>urn:epcglobal:cbv:bizstep:${event.eventType}</bizStep>
        <readPoint>
          <id>${event.location}</id>
        </readPoint>
        <bizLocation>
          <id>urn:epc:id:sgln:${event.actorGLN}</id>
        </bizLocation>
      </ObjectEvent>`).join('')}
    </EventList>
  </EPCISBody>
</epcis:EPCISDocument>`;
  }

  private mapEventTypeToTatmeen(eventType: string): string {
    const mapping: Record<string, string> = {
      'commission': 'commissioning',
      'ship': 'shipping',
      'receive': 'receiving',
      'dispense': 'dispensing',
      'qa-passed': 'quality_check'
    };
    return mapping[eventType] || eventType;
  }

  private getManufacturerGLN(manufacturerId: string): string {
    // In production, this would map to actual GLN registry
    return `0614141${manufacturerId.slice(-6).padStart(6, '0')}`;
  }

  private getActorGLN(actorId: string): string {
    // In production, this would map to actual GLN registry
    return `0614141${actorId.slice(-6).padStart(6, '0')}`;
  }
}
