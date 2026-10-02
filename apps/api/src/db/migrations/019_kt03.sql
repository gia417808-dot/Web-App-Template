CREATE TABLE IF NOT EXISTS "NhaCungCap" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ma_nha_cung_cap TEXT NOT NULL,
  ten_nha_cung_cap TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_nha_cung_cap)
);

CREATE TABLE IF NOT EXISTS "PhaiTra" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  nha_cung_cap_id UUID NOT NULL REFERENCES "NhaCungCap"(id),
  ma_phai_tra TEXT NOT NULL,
  so_goc INTEGER NOT NULL DEFAULT 0,
  da_thanh_toan INTEGER NOT NULL DEFAULT 0,
  con_lai INTEGER NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'OPEN' CHECK (trang_thai IN ('OPEN', 'PARTIALLY_PAID', 'SETTLED', 'OVERPAID')),
  han_thanh_toan DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_phai_tra)
);

CREATE TABLE IF NOT EXISTS "ThanhToanPhaiTra" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  phai_tra_id UUID NOT NULL REFERENCES "PhaiTra"(id) ON DELETE CASCADE,
  so_tien INTEGER NOT NULL DEFAULT 0 CHECK (so_tien > 0),
  ngay_thanh_toan DATE NOT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'CONFIRMED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
