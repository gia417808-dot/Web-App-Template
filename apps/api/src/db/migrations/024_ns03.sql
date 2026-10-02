CREATE TABLE IF NOT EXISTS "SoDuPhep" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  nhan_su_id UUID NOT NULL REFERENCES "NhanSu"(id),
  nam INTEGER NOT NULL,
  phep_dau_ky DECIMAL(5,2) NOT NULL DEFAULT 0,
  phep_phat_sinh DECIMAL(5,2) NOT NULL DEFAULT 0,
  phep_da_duyet DECIMAL(5,2) NOT NULL DEFAULT 0,
  phep_con_lai DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, nhan_su_id, nam)
);

CREATE TABLE IF NOT EXISTS "DonNghi" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  nhan_su_id UUID NOT NULL REFERENCES "NhanSu"(id),
  ngay_bat_dau DATE NOT NULL,
  ngay_ket_thuc DATE NOT NULL,
  so_ngay_nghi DECIMAL(5,2) NOT NULL CHECK (so_ngay_nghi > 0),
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
