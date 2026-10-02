CREATE TABLE IF NOT EXISTS "BangLuong" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  ky_luong TEXT NOT NULL,
  nhan_su_id UUID NOT NULL REFERENCES "NhanSu"(id),
  luong_thoa_thuan DECIMAL(19,4) NOT NULL DEFAULT 0,
  tong_phu_cap DECIMAL(19,4) NOT NULL DEFAULT 0,
  tong_khau_tru DECIMAL(19,4) NOT NULL DEFAULT 0,
  thuc_nhan DECIMAL(19,4) NOT NULL DEFAULT 0,
  trang_thai TEXT NOT NULL DEFAULT 'DRAFT' CHECK (trang_thai IN ('DRAFT', 'REVIEWED', 'LOCKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, ky_luong, nhan_su_id)
);

CREATE TABLE IF NOT EXISTS "KhoanDieuChinh" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  bang_luong_id UUID NOT NULL REFERENCES "BangLuong"(id) ON DELETE CASCADE,
  loai_dieu_chinh TEXT NOT NULL CHECK (loai_dieu_chinh IN ('PHU_CAP', 'KHAU_TRU')),
  so_tien DECIMAL(19,4) NOT NULL CHECK (so_tien >= 0),
  ly_do TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1
);
