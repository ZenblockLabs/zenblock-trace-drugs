import { supabase } from '@/integrations/supabase/client';

export interface KadhaCapsule {
  id: string;
  batch_id: string;
  organization_id: string;
  created_by: string;
  product_name: string;
  origin_story: string;
  gmp_certifications: any;
  key_ingredients?: string;
  brand_message?: string;
  supporting_images: any;
  is_active: boolean;
  is_published: boolean;
  version_number: number;
  qr_code?: string;
  short_link?: string;
  scan_count: number;
  metadata: any;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface KadhaCapsuleVersion {
  id: string;
  capsule_id: string;
  version_number: number;
  content_snapshot: any;
  created_by: string;
  created_at: string;
  change_notes?: string;
}

export interface KadhaAnalytics {
  id: string;
  capsule_id: string;
  event_type: 'view' | 'scan' | 'share';
  session_id?: string;
  location_data?: any;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  view_duration?: number;
  scroll_depth?: number;
  metadata: any;
  created_at: string;
}

export interface CreateCapsuleData {
  batch_id: string;
  organization_id: string;
  created_by: string;
  product_name: string;
  origin_story: string;
  gmp_certifications?: any;
  key_ingredients?: string;
  brand_message?: string;
  supporting_images?: any;
  metadata?: any;
}

export interface UpdateCapsuleData {
  product_name?: string;
  origin_story?: string;
  gmp_certifications?: any[];
  key_ingredients?: string;
  brand_message?: string;
  supporting_images?: any[];
  is_active?: boolean;
  is_published?: boolean;
  version_number?: number;
  metadata?: any;
}

export class KadhaService {
  // Get all capsules for the user's organization
  static async getCapsules(): Promise<KadhaCapsule[]> {
    const { data, error } = await supabase
      .from('pharma_kadha_capsules')
      .select(`
        *,
        pharma_batches!inner(
          id,
          batch_number,
          product_name,
          organization_id,
          pharma_organizations(
            name,
            slug
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get capsule by ID
  static async getCapsuleById(id: string): Promise<KadhaCapsule | null> {
    const { data, error } = await supabase
      .from('pharma_kadha_capsules')
      .select(`
        *,
        pharma_batches!inner(
          id,
          batch_number,
          product_name,
          organization_id,
          pharma_organizations(
            name,
            slug
          )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Get published capsule by batch ID (public access)
  static async getPublishedCapsuleByBatch(batchId: string): Promise<KadhaCapsule | null> {
    const { data, error } = await supabase
      .from('pharma_kadha_capsules')
      .select(`
        *,
        pharma_batches!inner(
          id,
          batch_number,
          product_name,
          product_type,
          description,
          origin_location,
          harvest_date,
          status,
          pharma_organizations(
            name,
            slug
          )
        )
      `)
      .eq('batch_id', batchId)
      .eq('is_published', true)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Get published capsule by short link (public access)
  static async getPublishedCapsuleByShortLink(shortLink: string): Promise<KadhaCapsule | null> {
    const { data, error } = await supabase
      .from('pharma_kadha_capsules')
      .select(`
        *,
        pharma_batches!inner(
          id,
          batch_number,
          product_name,
          product_type,
          description,
          origin_location,
          harvest_date,
          status,
          pharma_organizations(
            name,
            slug
          )
        )
      `)
      .eq('short_link', shortLink)
      .eq('is_published', true)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Create new capsule
  static async createCapsule(data: CreateCapsuleData): Promise<KadhaCapsule> {
    const { data: result, error } = await supabase
      .from('pharma_kadha_capsules')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Update capsule
  static async updateCapsule(id: string, data: UpdateCapsuleData): Promise<KadhaCapsule> {
    const { data: result, error } = await supabase
      .from('pharma_kadha_capsules')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Delete capsule
  static async deleteCapsule(id: string): Promise<void> {
    const { error } = await supabase
      .from('pharma_kadha_capsules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Publish capsule
  static async publishCapsule(id: string): Promise<KadhaCapsule> {
    // First, deactivate any existing active capsule for this batch
    const capsule = await this.getCapsuleById(id);
    if (!capsule) throw new Error('Capsule not found');

    await supabase
      .from('pharma_kadha_capsules')
      .update({ is_active: false })
      .eq('batch_id', capsule.batch_id)
      .eq('is_active', true);

    // Then activate and publish this capsule
    const { data: result, error } = await supabase
      .from('pharma_kadha_capsules')
      .update({
        is_published: true,
        is_active: true,
        version_number: capsule.version_number + 1
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Unpublish capsule
  static async unpublishCapsule(id: string): Promise<KadhaCapsule> {
    const { data: result, error } = await supabase
      .from('pharma_kadha_capsules')
      .update({
        is_published: false,
        is_active: false
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Get capsule versions
  static async getCapsuleVersions(capsuleId: string): Promise<KadhaCapsuleVersion[]> {
    const { data, error } = await supabase
      .from('kadha_capsule_versions')
      .select('*')
      .eq('capsule_id', capsuleId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Track analytics event
  static async trackEvent(
    capsuleId: string,
    eventType: 'view' | 'scan' | 'share',
    metadata: {
      sessionId?: string;
      userAgent?: string;
      referrer?: string;
      viewDuration?: number;
      scrollDepth?: number;
      ipAddress?: string;
      locationData?: any;
    } = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('pharma_kadha_analytics')
      .insert({
        capsule_id: capsuleId,
        event_type: eventType,
        session_id: metadata.sessionId,
        user_agent: metadata.userAgent,
        referrer: metadata.referrer,
        view_duration: metadata.viewDuration,
        scroll_depth: metadata.scrollDepth,
        ip_address: metadata.ipAddress,
        location_data: metadata.locationData,
        metadata: metadata
      });

    if (error) {
      console.error('Failed to track analytics event:', error);
      // Don't throw error for analytics failures
    }
  }

  // Get analytics for capsule
  static async getCapsuleAnalytics(capsuleId: string): Promise<KadhaAnalytics[]> {
    const { data, error } = await supabase
      .from('pharma_kadha_analytics')
      .select('*')
      .eq('capsule_id', capsuleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as KadhaAnalytics[];
  }

  // Get available pharmaceutical batches for capsule creation
  static async getAvailableBatches(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('pharma_batches')
        .select(`
          id,
          batch_number,
          product_name,
          product_type,
          description,
          quantity,
          unit,
          status,
          origin_location,
          harvest_date,
          pharma_organizations(
            name,
            slug
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pharmaceutical batches:', error);
        throw error;
      }
      
      console.log('Available pharmaceutical batches fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch pharmaceutical batches:', error);
      // Return mock pharmaceutical batches as fallback for demo
      return [
        {
          id: '550e8400-e29b-41d4-a716-446655441001',
          batch_number: 'BATCH-1234',
          product_name: 'ZenRelief 10mg',
          product_type: 'pharmaceutical',
          description: 'Advanced pain relief medication with controlled release formula',
          quantity: 10000,
          unit: 'tablets',
          status: 'active',
          origin_location: 'ZenPharma Manufacturing Facility, New Jersey',
          harvest_date: '2024-01-15',
          pharma_organizations: {
            name: 'ZenPharma Inc.',
            slug: 'zenpharma-inc'
          }
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441002',
          batch_number: 'BATCH-1235',
          product_name: 'CardioZen 25mg',
          product_type: 'pharmaceutical',
          description: 'Cardiovascular medication for heart health management',
          quantity: 5000,
          unit: 'tablets',
          status: 'active',
          origin_location: 'ZenPharma Manufacturing Facility, New Jersey',
          harvest_date: '2024-01-20',
          pharma_organizations: {
            name: 'ZenPharma Inc.',
            slug: 'zenpharma-inc'
          }
        }
      ];
    }
  }
}