CREATE TABLE IF NOT EXISTS "ThuNghiem" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL,
  noi_dung_id UUID NOT NULL REFERENCES "NoiDung"(id),
  ten_thu_nghiem TEXT NOT NULL,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'RUNNING', 'COMPLETED', 'CANCELED')),
  ngay_bat_dau DATE,
  ngay_ket_thuc DATE,
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "BienThe" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL,
  thu_nghiem_id UUID NOT NULL REFERENCES "ThuNghiem"(id),
  ten_bien_the TEXT NOT NULL,
  luot_tiep_can INTEGER NOT NULL DEFAULT 0,
  phan_hoi INTEGER NOT NULL DEFAULT 0,
  ty_le_phan_hoi DECIMAL,
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
