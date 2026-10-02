CREATE TABLE IF NOT EXISTS "MucTonKho" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  kho_id UUID NOT NULL REFERENCES "Kho"(id),
  san_pham_id UUID NOT NULL REFERENCES "SanPham"(id),
  ton_muc_tieu INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, kho_id, san_pham_id)
);

CREATE TABLE IF NOT EXISTS "CanhBaoBoSung" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  muc_ton_id UUID NOT NULL REFERENCES "MucTonKho"(id),
  ton_kha_dung INTEGER NOT NULL DEFAULT 0,
  luong_goi_y INTEGER NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'OPEN' CHECK (trang_thai IN ('OPEN', 'ACKNOWLEDGED', 'RESOLVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
