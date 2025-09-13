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
      .from('kadha_capsules')
      .select(`
        *,
        batches!inner(
          id,
          batch_number,
          product_name,
          organization_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get capsule by ID
  static async getCapsuleById(id: string): Promise<KadhaCapsule | null> {
    const { data, error } = await supabase
      .from('kadha_capsules')
      .select(`
        *,
        batches!inner(
          id,
          batch_number,
          product_name,
          organization_id
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
      .from('kadha_capsules')
      .select(`
        *,
        batches!inner(
          id,
          batch_number,
          product_name,
          product_type,
          description,
          origin_location,
          harvest_date,
          status
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
      .from('kadha_capsules')
      .select(`
        *,
        batches!inner(
          id,
          batch_number,
          product_name,
          product_type,
          description,
          origin_location,
          harvest_date,
          status
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
      .from('kadha_capsules')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Update capsule
  static async updateCapsule(id: string, data: UpdateCapsuleData): Promise<KadhaCapsule> {
    const { data: result, error } = await supabase
      .from('kadha_capsules')
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
      .from('kadha_capsules')
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
      .from('kadha_capsules')
      .update({ is_active: false })
      .eq('batch_id', capsule.batch_id)
      .eq('is_active', true);

    // Then activate and publish this capsule
    const { data: result, error } = await supabase
      .from('kadha_capsules')
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
      .from('kadha_capsules')
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
      .from('kadha_analytics')
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
      .from('kadha_analytics')
      .select('*')
      .eq('capsule_id', capsuleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as KadhaAnalytics[];
  }

  // Get available batches for capsule creation - updated for mock auth
  static async getAvailableBatches(): Promise<any[]> {
    try {
      // For now, return all active batches since we're using mock authentication
      // In production, this would be filtered by organization via RLS
      const { data, error } = await supabase
        .from('batches')
        .select(`
          id,
          batch_number,
          product_name,
          status,
          organization_id
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching available batches:', error);
        throw error;
      }
      
      // Filter to only pharma/Kadha-related batches
      const pharmaBatches = (data || []).filter(batch => {
        const productName = batch.product_name?.toLowerCase() || '';
        const batchNumber = batch.batch_number?.toLowerCase() || '';
        
        // Include batches that are pharma/Kadha related
        return (
          batchNumber.startsWith('bth-') || // BTH prefix for Kadha batches
          productName.includes('capsule') ||
          productName.includes('extract') ||
          productName.includes('blend') ||
          productName.includes('kadha') ||
          productName.includes('turmeric') ||
          productName.includes('ashwagandha') ||
          productName.includes('immunity')
        ) && (
          // Exclude non-pharma products
          !productName.includes('tomato') &&
          !productName.includes('ibuprofen') &&
          !batchNumber.startsWith('org') // Exclude organic farming batches
        );
      });
      
      console.log('Available pharma batches fetched:', pharmaBatches.length, 'of', data?.length || 0, 'total batches');
      return pharmaBatches;
    } catch (error) {
      console.error('Failed to fetch available batches:', error);
      // Return mock batches as fallback for demo
      return [
        {
          id: '550e8400-e29b-41d4-a716-446655440010',
          batch_number: 'BTH-001',
          product_name: 'Organic Turmeric Capsules',
          status: 'active',
          organization_id: '550e8400-e29b-41d4-a716-446655440000'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440011',
          batch_number: 'BTH-002',
          product_name: 'Ashwagandha Extract',
          status: 'active',
          organization_id: '550e8400-e29b-41d4-a716-446655440000'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440012',
          batch_number: 'BTH-003',
          product_name: 'Kadha Immunity Blend',
          status: 'active',
          organization_id: '550e8400-e29b-41d4-a716-446655440000'
        }
      ];
    }
  }
}