CREATE TABLE IF NOT EXISTS "NganSach" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  hang_muc_id UUID NOT NULL REFERENCES "HangMucNganSach"(id),
  ma_ngan_sach TEXT NOT NULL,
  ky_ngan_sach TEXT NOT NULL,
  du_toan INTEGER NOT NULL DEFAULT 0,
  thuc_chi INTEGER NOT NULL DEFAULT 0,
  chenh_lech INTEGER NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'APPROVED', 'LOCKED')),
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_ngan_sach),
  UNIQUE(organization_id, hang_muc_id, ky_ngan_sach)
);
