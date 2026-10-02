CREATE TABLE IF NOT EXISTS "NhanSu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ma_nhan_vien TEXT NOT NULL,
  ho_ten TEXT NOT NULL,
  ngay_vao_lam DATE NOT NULL,
  tham_nien_ngay INTEGER NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (trang_thai IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_nhan_vien)
);

CREATE TABLE IF NOT EXISTS "TaiLieuNhanSu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  nhan_su_id UUID NOT NULL REFERENCES "NhanSu"(id) ON DELETE CASCADE,
  ten_tai_lieu TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
