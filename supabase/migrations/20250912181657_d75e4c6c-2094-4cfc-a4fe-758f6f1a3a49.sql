-- Step 1: Add brand_manager role to user_role enum
-- This must be done in a separate transaction
ALTER TYPE public.user_role ADD VALUE 'brand_manager';