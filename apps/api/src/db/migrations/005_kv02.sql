CREATE TABLE "Kho" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);

CREATE TABLE "PhieuKho" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES "Kho"(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'transfer', 'adjustment')),
  business_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  source_type TEXT,
  source_id UUID,
  reversal_of_id UUID REFERENCES "PhieuKho"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);

CREATE TABLE "DongPhieuKho" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  voucher_id UUID NOT NULL REFERENCES "PhieuKho"(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES "SanPham"(id),
  quantity DECIMAL(19,4) NOT NULL CHECK (quantity > 0),
  unit_cost_vnd DECIMAL(19,4),
  source_line_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "StockLedger" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  warehouse_line_id UUID NOT NULL REFERENCES "DongPhieuKho"(id) UNIQUE,
  product_id UUID NOT NULL REFERENCES "SanPham"(id),
  warehouse_id UUID NOT NULL REFERENCES "Kho"(id),
  quantity_delta DECIMAL(19,4) NOT NULL,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cost_total_vnd DECIMAL(19,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "Reservation" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  order_line_id UUID NOT NULL REFERENCES "ChiTietDon"(id),
  product_id UUID NOT NULL REFERENCES "SanPham"(id),
  warehouse_id UUID NOT NULL REFERENCES "Kho"(id),
  quantity DECIMAL(19,4) NOT NULL CHECK (quantity > 0),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'FULFILLED', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
);
