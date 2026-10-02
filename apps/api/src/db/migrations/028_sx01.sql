CREATE TABLE IF NOT EXISTS "LenhSanXuat" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ma_lenh TEXT NOT NULL,
  san_pham_ma TEXT NOT NULL,
  luong_ke_hoach DECIMAL(19,4) NOT NULL CHECK (luong_ke_hoach > 0),
  luong_dat DECIMAL(19,4) NOT NULL DEFAULT 0,
  luong_loi DECIMAL(19,4) NOT NULL DEFAULT 0,
  ty_le_hoan_thanh DECIMAL(5,4) NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_lenh)
);

CREATE TABLE IF NOT EXISTS "CongDoan" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  lenh_san_xuat_id UUID NOT NULL REFERENCES "LenhSanXuat"(id) ON DELETE CASCADE,
  ten_cong_doan TEXT NOT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'PENDING' CHECK (trang_thai IN ('PENDING', 'DOING', 'DONE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
