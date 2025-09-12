import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KadhaService, KadhaCapsule, CreateCapsuleData, UpdateCapsuleData } from '@/services/kadha/KadhaService';
import { toast } from 'sonner';

export function useKadhaCapsules() {
  return useQuery({
    queryKey: ['kadha-capsules'],
    queryFn: KadhaService.getCapsules,
  });
}

export function useKadhaCapsule(id: string | undefined) {
  return useQuery({
    queryKey: ['kadha-capsule', id],
    queryFn: () => id ? KadhaService.getCapsuleById(id) : null,
    enabled: !!id,
  });
}

export function usePublishedCapsuleByBatch(batchId: string | undefined) {
  return useQuery({
    queryKey: ['published-capsule-batch', batchId],
    queryFn: () => batchId ? KadhaService.getPublishedCapsuleByBatch(batchId) : null,
    enabled: !!batchId,
  });
}

export function usePublishedCapsuleByShortLink(shortLink: string | undefined) {
  return useQuery({
    queryKey: ['published-capsule-shortlink', shortLink],
    queryFn: () => shortLink ? KadhaService.getPublishedCapsuleByShortLink(shortLink) : null,
    enabled: !!shortLink,
  });
}

export function useAvailableBatches() {
  return useQuery({
    queryKey: ['available-batches'],
    queryFn: KadhaService.getAvailableBatches,
  });
}

export function useKadhaCapsuleVersions(capsuleId: string | undefined) {
  return useQuery({
    queryKey: ['kadha-capsule-versions', capsuleId],
    queryFn: () => capsuleId ? KadhaService.getCapsuleVersions(capsuleId) : [],
    enabled: !!capsuleId,
  });
}

export function useKadhaCapsuleAnalytics(capsuleId: string | undefined) {
  return useQuery({
    queryKey: ['kadha-capsule-analytics', capsuleId],
    queryFn: () => capsuleId ? KadhaService.getCapsuleAnalytics(capsuleId) : [],
    enabled: !!capsuleId,
  });
}

export function useKadhaMutations() {
  const queryClient = useQueryClient();

  const createCapsule = useMutation({
    mutationFn: (data: CreateCapsuleData) => KadhaService.createCapsule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kadha-capsules'] });
      toast.success('Kadha capsule created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create capsule: ${error.message}`);
    },
  });

  const updateCapsule = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCapsuleData }) =>
      KadhaService.updateCapsule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kadha-capsules'] });
      queryClient.invalidateQueries({ queryKey: ['kadha-capsule'] });
      toast.success('Kadha capsule updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update capsule: ${error.message}`);
    },
  });

  const deleteCapsule = useMutation({
    mutationFn: (id: string) => KadhaService.deleteCapsule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kadha-capsules'] });
      toast.success('Kadha capsule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete capsule: ${error.message}`);
    },
  });

  const publishCapsule = useMutation({
    mutationFn: (id: string) => KadhaService.publishCapsule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kadha-capsules'] });
      queryClient.invalidateQueries({ queryKey: ['kadha-capsule'] });
      toast.success('Kadha capsule published successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to publish capsule: ${error.message}`);
    },
  });

  const unpublishCapsule = useMutation({
    mutationFn: (id: string) => KadhaService.unpublishCapsule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kadha-capsules'] });
      queryClient.invalidateQueries({ queryKey: ['kadha-capsule'] });
      toast.success('Kadha capsule unpublished successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to unpublish capsule: ${error.message}`);
    },
  });

  return {
    createCapsule,
    updateCapsule,
    deleteCapsule,
    publishCapsule,
    unpublishCapsule,
  };
}

// Hook for tracking analytics events
export function useKadhaAnalytics() {
  const trackEvent = async (
    capsuleId: string,
    eventType: 'view' | 'scan' | 'share',
    metadata: any = {}
  ) => {
    try {
      // Generate session ID if not provided
      if (!metadata.sessionId) {
        metadata.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Get user agent
      if (!metadata.userAgent && typeof navigator !== 'undefined') {
        metadata.userAgent = navigator.userAgent;
      }

      // Get referrer
      if (!metadata.referrer && typeof document !== 'undefined') {
        metadata.referrer = document.referrer;
      }

      await KadhaService.trackEvent(capsuleId, eventType, metadata);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  };

  return { trackEvent };
}

// Hook for managing view session and scroll tracking
export function useKadhaViewTracking(capsuleId: string | undefined) {
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);
  const [maxScrollDepth, setMaxScrollDepth] = useState(0);
  const { trackEvent } = useKadhaAnalytics();

  useEffect(() => {
    if (!capsuleId) return;

    // Track view start
    setViewStartTime(Date.now());
    trackEvent(capsuleId, 'view');

    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      
      if (scrollDepth > maxScrollDepth) {
        setMaxScrollDepth(scrollDepth);
      }
    };

    // Track view end on page unload
    const handleBeforeUnload = () => {
      if (viewStartTime) {
        const viewDuration = Math.round((Date.now() - viewStartTime) / 1000);
        trackEvent(capsuleId, 'view', {
          viewDuration,
          scrollDepth: maxScrollDepth
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Track view end when component unmounts
      if (viewStartTime) {
        const viewDuration = Math.round((Date.now() - viewStartTime) / 1000);
        trackEvent(capsuleId, 'view', {
          viewDuration,
          scrollDepth: maxScrollDepth
        });
      }
    };
  }, [capsuleId, viewStartTime, maxScrollDepth, trackEvent]);
}