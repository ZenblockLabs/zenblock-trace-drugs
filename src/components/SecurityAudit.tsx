
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SecurityEvent {
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
}

export const useSecurityAudit = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    if (!user) return;

    try {
      // In development, this RPC function may not exist, so we'll handle it gracefully
      const { error } = await supabase.rpc('log_security_event' as any, {
        p_action: event.action,
        p_resource_type: event.resourceType,
        p_resource_id: event.resourceId || null,
        p_details: event.details || null
      });
      
      if (error) {
        // Log to console in development when RPC function doesn't exist
        console.log('Security event (dev mode):', event);
      }
    } catch (error) {
      // Silently handle missing RPC function in development
      console.log('Security event (dev mode):', event);
    }
  };

  return { logSecurityEvent };
};

// Hook to log page access events
export const usePageAccessLog = (pageName: string) => {
  const { logSecurityEvent } = useSecurityAudit();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      logSecurityEvent({
        action: 'page_access',
        resourceType: 'page',
        resourceId: pageName,
        details: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent.substring(0, 200) // Limit length
        }
      });
    }
  }, [user, pageName, logSecurityEvent]);
};
