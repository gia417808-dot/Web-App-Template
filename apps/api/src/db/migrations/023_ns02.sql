CREATE TABLE IF NOT EXISTS "CaLam" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ma_ca TEXT NOT NULL,
  gio_vao TIME NOT NULL,
  gio_ra TIME NOT NULL,
  tru_gio_nghi DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_ca)
);

CREATE TABLE IF NOT EXISTS "ChamCong" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  nhan_su_id UUID NOT NULL REFERENCES "NhanSu"(id),
  ca_lam_id UUID NOT NULL REFERENCES "CaLam"(id),
  ngay_cham_cong DATE NOT NULL,
  gio_vao_thuc_te TIME,
  gio_ra_thuc_te TIME,
  tong_gio_lam DECIMAL(5,2),
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, nhan_su_id, ngay_cham_cong)
);
