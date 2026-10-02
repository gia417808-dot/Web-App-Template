CREATE TABLE IF NOT EXISTS "UngVien" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ho_ten TEXT NOT NULL,
  vi_tri_ung_tuyen TEXT NOT NULL,
  ngay_mo_vi_tri DATE NOT NULL,
  ngay_nhan_viec DATE,
  thoi_gian_tuyen INTEGER,
  trang_thai TEXT NOT NULL DEFAULT 'APPLIED' CHECK (trang_thai IN ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED', 'WITHDRAWN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "VongTuyen" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ung_vien_id UUID NOT NULL REFERENCES "UngVien"(id) ON DELETE CASCADE,
  vong_truoc TEXT NOT NULL,
  vong_sau TEXT NOT NULL,
  ngay_chuyen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
