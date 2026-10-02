CREATE TABLE IF NOT EXISTS "VatTu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ma_vat_tu TEXT NOT NULL,
  ten_vat_tu TEXT NOT NULL,
  dvt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ma_vat_tu)
);

CREATE TABLE IF NOT EXISTS "DinhMuc" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  san_pham_ma TEXT NOT NULL,
  vat_tu_id UUID NOT NULL REFERENCES "VatTu"(id),
  so_luong_dinh_muc DECIMAL(19,4) NOT NULL CHECK (so_luong_dinh_muc > 0),
  ty_le_hao_hut DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (ty_le_hao_hut >= 0 AND ty_le_hao_hut <= 100),
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'APPROVED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "DuTruVatTu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  dinh_muc_id UUID NOT NULL REFERENCES "DinhMuc"(id),
  luong_ke_hoach DECIMAL(19,4) NOT NULL CHECK (luong_ke_hoach > 0),
  luong_can DECIMAL(19,4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
