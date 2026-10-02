CREATE TABLE IF NOT EXISTS "PhaiThu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  khach_hang_id UUID NOT NULL REFERENCES "KhachHang"(id),
  ma_phai_thu TEXT NOT NULL,
  so_goc INTEGER NOT NULL DEFAULT 0,
  da_thanh_toan INTEGER NOT NULL DEFAULT 0,
  con_lai INTEGER NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'OPEN' CHECK (trang_thai IN ('OPEN', 'PARTIALLY_PAID', 'SETTLED', 'OVERPAID')),
  han_thanh_toan DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_phai_thu)
);

CREATE TABLE IF NOT EXISTS "ThanhToanPhaiThu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  phai_thu_id UUID NOT NULL REFERENCES "PhaiThu"(id) ON DELETE CASCADE,
  so_tien INTEGER NOT NULL DEFAULT 0 CHECK (so_tien > 0),
  ngay_thanh_toan DATE NOT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'CONFIRMED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
