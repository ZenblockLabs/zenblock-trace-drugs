
import { z } from 'zod';

// SGTIN Schema - validates Serialized Global Trade Item Number format
export const sgtinSchema = z.string()
  .min(1, 'SGTIN is required')
  .regex(/^[0-9]{14,30}$/, 'SGTIN must be 14-30 digits only')
  .refine((val) => val.length >= 14 && val.length <= 30, {
    message: 'SGTIN must be between 14 and 30 digits'
  });

// Drug ID Schema - validates drug identifier format
export const drugIdSchema = z.string()
  .min(1, 'Drug ID is required')
  .regex(/^[A-Z0-9\-_]{3,50}$/, 'Drug ID must be 3-50 characters, alphanumeric with dashes and underscores only');

// Organization ID Schema - validates organization identifier
export const organizationIdSchema = z.string()
  .min(1, 'Organization ID is required')
  .regex(/^[a-z0-9\-_]{3,50}$/, 'Organization ID must be 3-50 characters, lowercase alphanumeric with dashes and underscores only');

// Safe Text Schema - prevents XSS and validates general text input
export const safeTextSchema = z.string()
  .min(1, 'This field is required')
  .max(500, 'Text must be less than 500 characters')
  .regex(/^[a-zA-Z0-9\s\-_.,!?()@#$%&*+=[\]{}|\\:";'<>/?~`]*$/, 'Text contains invalid characters');

// Email Schema
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(1, 'Email is required');

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Generic validation function
export function validateInput<T>(schema: z.ZodSchema<T>, value: unknown): ValidationResult {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Validation failed'
      };
    }
    return {
      isValid: false,
      error: 'Unknown validation error'
    };
  }
}

// XSS prevention - sanitizes text input
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 500); // Limit length
}

// Specific validation helpers
export const validateSgtin = (sgtin: string): ValidationResult => 
  validateInput(sgtinSchema, sgtin);

export const validateDrugId = (drugId: string): ValidationResult => 
  validateInput(drugIdSchema, drugId);

export const validateOrganizationId = (orgId: string): ValidationResult => 
  validateInput(organizationIdSchema, orgId);

export const validateSafeText = (text: string): ValidationResult => 
  validateInput(safeTextSchema, text);

export const validateEmail = (email: string): ValidationResult => 
  validateInput(emailSchema, email);
