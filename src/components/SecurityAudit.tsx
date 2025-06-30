
import { useEffect } from 'react';
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

    // Log security events to console in development
    // In production, this could be replaced with actual logging service
    console.log('Security Event:', {
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
      ...event
    });
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
