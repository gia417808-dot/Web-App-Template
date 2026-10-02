CREATE TABLE "KhachHang" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  owner_id UUID REFERENCES "NguoiDung"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, code)
);

CREATE TABLE "BaoGia" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES "KhachHang"(id),
  business_date DATE NOT NULL,
  valid_until DATE NOT NULL,
  status TEXT NOT NULL,
  total_vnd DECIMAL NOT NULL DEFAULT 0,
  converted_order_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, code)
);

CREATE TABLE "ChiTietBaoGia" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  quote_id UUID NOT NULL REFERENCES "BaoGia"(id),
  product_id UUID NOT NULL REFERENCES "SanPham"(id),
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  unit_price_vnd DECIMAL NOT NULL CHECK (unit_price_vnd >= 0),
  discount_pct DECIMAL NOT NULL CHECK (discount_pct >= 0 AND discount_pct <= 100),
  line_total_vnd DECIMAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE "DonHang" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES "KhachHang"(id),
  quote_id UUID REFERENCES "BaoGia"(id),
  business_date DATE NOT NULL,
  status TEXT NOT NULL,
  confirmed_at TIMESTAMPTZ,
  total_vnd DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, code)
);

ALTER TABLE "BaoGia" ADD CONSTRAINT fk_baogia_order FOREIGN KEY (converted_order_id) REFERENCES "DonHang"(id);

CREATE TABLE "ChiTietDon" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  order_id UUID NOT NULL REFERENCES "DonHang"(id),
  product_id UUID NOT NULL REFERENCES "SanPham"(id),
  sequence INTEGER NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  unit_snapshot TEXT NOT NULL,
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  unit_price_vnd DECIMAL NOT NULL CHECK (unit_price_vnd >= 0),
  discount_pct DECIMAL NOT NULL CHECK (discount_pct >= 0 AND discount_pct <= 100),
  line_total_vnd DECIMAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, order_id, sequence)
);
