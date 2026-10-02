CREATE TABLE IF NOT EXISTS "LaiGopDonHang" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  don_hang_id UUID NOT NULL REFERENCES "DonHang"(id) ON DELETE CASCADE,
  doanh_thu_thuan INTEGER NOT NULL DEFAULT 0,
  tong_gia_von INTEGER,
  lai_gop INTEGER,
  trang_thai TEXT NOT NULL DEFAULT 'CALCULATED' CHECK (trang_thai IN ('CALCULATED', 'REVIEWED', 'MISSING_COST')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, don_hang_id)
);

CREATE TABLE IF NOT EXISTS "LaiGopChiTiet" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  lai_gop_don_id UUID NOT NULL REFERENCES "LaiGopDonHang"(id) ON DELETE CASCADE,
  chi_tiet_don_id UUID NOT NULL REFERENCES "ChiTietDon"(id),
  doanh_thu INTEGER NOT NULL DEFAULT 0,
  gia_von INTEGER,
  lai_gop INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, lai_gop_don_id, chi_tiet_don_id)
);
