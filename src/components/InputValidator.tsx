
import { z } from 'zod';

// SGTIN validation schema following GS1 standards
export const sgtinSchema = z.string()
  .min(1, 'SGTIN is required')
  .regex(
    /^(\d{1,2})(\d{7})(\d{6})(\d{12})$/,
    'Invalid SGTIN format. Expected: Company Prefix (7 digits) + Item Reference (6 digits) + Serial Number (12 digits)'
  )
  .refine(
    (value) => {
      // Additional GS1 checksum validation can be added here
      return value.length <= 30;
    },
    'SGTIN too long'
  );

// Drug ID validation
export const drugIdSchema = z.string()
  .min(1, 'Drug ID is required')
  .regex(/^[A-Z]-\d{3,6}$/, 'Drug ID must follow format: Letter-Number (e.g., D-101)')
  .max(10, 'Drug ID too long');

// Batch number validation
export const batchSchema = z.string()
  .min(1, 'Batch number is required')
  .regex(/^[A-Z0-9-]{3,20}$/, 'Batch number can only contain letters, numbers, and hyphens')
  .max(20, 'Batch number too long');

// Organization ID validation
export const organizationIdSchema = z.string()
  .min(1, 'Organization ID is required')
  .regex(/^[a-z0-9-]+$/, 'Organization ID can only contain lowercase letters, numbers, and hyphens')
  .max(50, 'Organization ID too long');

// Email validation with XSS protection
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(320, 'Email too long')
  .refine(
    (value) => !/<script|javascript:|on\w+=/i.test(value),
    'Invalid email content'
  );

// Generic text validation with XSS protection
export const safeTextSchema = z.string()
  .max(1000, 'Text too long')
  .refine(
    (value) => !/<script|javascript:|on\w+=/i.test(value),
    'Invalid characters detected'
  );

// Validation utilities
export const validateInput = <T>(schema: z.ZodSchema<T>, value: unknown): { 
  isValid: boolean; 
  data?: T; 
  error?: string; 
} => {
  try {
    const data = schema.parse(value);
    return { isValid: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || 'Validation failed' 
      };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

// XSS sanitization utility
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
