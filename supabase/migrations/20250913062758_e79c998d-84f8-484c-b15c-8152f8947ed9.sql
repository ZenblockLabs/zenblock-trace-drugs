-- Insert test organization for brand manager
INSERT INTO organizations (id, name, slug, description, status, industry) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Zenblock Labs', 'zenblock-labs', 'Innovative pharmaceutical company', 'active', 'pharmaceutical');

-- Insert user profile for brand manager
INSERT INTO user_profiles (user_id, organization_id, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'brand_manager');

-- Insert test batches for the organization
INSERT INTO batches (id, organization_id, batch_number, product_name, product_type, description, status, quantity, unit) VALUES 
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'BTH-001', 'Organic Turmeric Capsules', 'nutraceutical', 'Premium organic turmeric with curcumin', 'active', 1000, 'capsules'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'BTH-002', 'Ashwagandha Extract', 'nutraceutical', 'High-potency ashwagandha root extract', 'active', 500, 'bottles'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'BTH-003', 'Kadha Immunity Blend', 'traditional', 'Traditional ayurvedic immunity booster', 'active', 200, 'bottles');