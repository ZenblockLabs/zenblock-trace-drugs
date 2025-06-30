
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { validateInput, sgtinSchema, sanitizeText } from '@/components/InputValidator';
import { useSecurityAudit } from '@/components/SecurityAudit';

interface SecureSgtinInputProps {
  value: string;
  onChange: (value: string) => void;
  onValid: (isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function SecureSgtinInput({
  value,
  onChange,
  onValid,
  label = "SGTIN (Serialized Global Trade Item Number)",
  placeholder = "Enter SGTIN (e.g., 30614141123458901234567890)",
  className
}: SecureSgtinInputProps) {
  const [validationError, setValidationError] = useState<string>('');
  const [isValid, setIsValid] = useState(false);
  const { logSecurityEvent } = useSecurityAudit();

  useEffect(() => {
    if (!value) {
      setValidationError('');
      setIsValid(false);
      onValid(false);
      return;
    }

    const validation = validateInput(sgtinSchema, value);
    
    if (validation.isValid) {
      setValidationError('');
      setIsValid(true);
      onValid(true);
    } else {
      setValidationError(validation.error || 'Invalid SGTIN format');
      setIsValid(false);
      onValid(false);
      
      // Log invalid input attempts for security monitoring
      logSecurityEvent({
        action: 'invalid_input_attempt',
        resourceType: 'sgtin_input',
        details: {
          error: validation.error,
          inputLength: value.length,
          sanitizedInput: sanitizeText(value.substring(0, 50)) // Log first 50 chars only
        }
      });
    }
  }, [value, onValid, logSecurityEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeText(e.target.value);
    onChange(sanitizedValue);
  };

  return (
    <div className={className}>
      <Label htmlFor="sgtin-input">{label}</Label>
      <div className="relative">
        <Input
          id="sgtin-input"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pr-10 ${validationError ? 'border-red-500' : isValid ? 'border-green-500' : ''}`}
          maxLength={30}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {value && (
            isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )
          )}
        </div>
      </div>
      
      {validationError && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      {isValid && (
        <Alert className="mt-2 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Valid SGTIN format
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-xs text-muted-foreground mt-1">
        Format: Company Prefix (7 digits) + Item Reference (6 digits) + Serial Number (12 digits)
      </p>
    </div>
  );
}
