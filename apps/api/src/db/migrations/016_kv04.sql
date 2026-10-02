CREATE TABLE IF NOT EXISTS "DotKiemKe" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  kho_id UUID NOT NULL REFERENCES "Kho"(id),
  ma_kiem_ke TEXT NOT NULL,
  ngay_kiem_ke DATE NOT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'COUNTING', 'REVIEWED', 'POSTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_kiem_ke)
);

CREATE TABLE IF NOT EXISTS "DongKiemKe" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  dot_kiem_ke_id UUID NOT NULL REFERENCES "DotKiemKe"(id) ON DELETE CASCADE,
  san_pham_id UUID NOT NULL REFERENCES "SanPham"(id),
  ton_so INTEGER NOT NULL DEFAULT 0,
  dem_thuc_te INTEGER NOT NULL DEFAULT 0,
  lech INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
