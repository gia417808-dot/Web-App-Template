CREATE TABLE IF NOT EXISTS "YeuCauMua" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ma_yeu_cau TEXT NOT NULL,
  san_pham_id UUID NOT NULL REFERENCES "SanPham"(id),
  so_luong INTEGER NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'APPROVED', 'CLOSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_yeu_cau)
);

CREATE TABLE IF NOT EXISTS "DonMua" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  yeu_cau_id UUID REFERENCES "YeuCauMua"(id),
  san_pham_id UUID NOT NULL REFERENCES "SanPham"(id),
  ma_don TEXT NOT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED')),
  luong_dat INTEGER NOT NULL DEFAULT 0,
  luong_nhan_hop_le INTEGER NOT NULL DEFAULT 0,
  chenh_lech_nhan INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_don)
);
