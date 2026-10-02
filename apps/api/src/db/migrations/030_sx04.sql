CREATE TABLE IF NOT EXISTS "LoaiLoi" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ma_loi TEXT NOT NULL,
  ten_loi TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, ma_loi)
);

CREATE TABLE IF NOT EXISTS "PhieuKiem" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  lenh_san_xuat_id UUID NOT NULL REFERENCES "LenhSanXuat"(id),
  so_luong_kiem DECIMAL(19,4) NOT NULL DEFAULT 0 CHECK (so_luong_kiem >= 0),
  so_luong_loi DECIMAL(19,4) NOT NULL DEFAULT 0 CHECK (so_luong_loi >= 0),
  ty_le_loi DECIMAL(5,4) DEFAULT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'INSPECTED', 'APPROVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  CHECK (so_luong_loi <= so_luong_kiem)
);
