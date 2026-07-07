-- Supabase Migration: Create Invoices Table
-- Run this SQL in your Supabase SQL Editor at https://supabase.com

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  travel_date DATE,
  currency VARCHAR(10) DEFAULT 'AED',
  items JSONB,
  total_cost DECIMAL(12, 2),
  total_margin DECIMAL(12, 2),
  total_upsell DECIMAL(12, 2),
  discount DECIMAL(12, 2),
  grand_total DECIMAL(12, 2),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS invoices_invoice_number_idx ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS invoices_quote_id_idx ON invoices(quote_id);
CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON invoices(client_id);
CREATE INDEX IF NOT EXISTS invoices_created_by_idx ON invoices(created_by);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON invoices(created_at);

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can see all invoices
CREATE POLICY "Admins can see all invoices" ON invoices
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND "Roles" IN ('Super Admin', 'Admin')
  )
);

-- RLS Policy: Admins can insert invoices
CREATE POLICY "Admins can create invoices" ON invoices
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND "Roles" IN ('Super Admin', 'Admin')
  )
);

-- RLS Policy: Admins can update invoices
CREATE POLICY "Admins can update invoices" ON invoices
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND "Roles" IN ('Super Admin', 'Admin')
  )
);

-- RLS Policy: Admins can delete invoices
CREATE POLICY "Admins can delete invoices" ON invoices
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND "Roles" IN ('Super Admin', 'Admin')
  )
);
