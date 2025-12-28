
-- Update handle_new_user function to remove email allowlist restriction
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile for new user (no email restriction)
  INSERT INTO public.user_profiles (user_id, role)
  VALUES (NEW.id, 'producer')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;
