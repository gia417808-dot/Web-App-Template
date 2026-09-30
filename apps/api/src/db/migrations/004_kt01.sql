CREATE TABLE "HangMucNganSach" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "PhaiThu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  customer_id UUID REFERENCES "KhachHang"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "PhaiTra" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  supplier_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "TaiKhoanTien" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  opening_balance DECIMAL(19,4) NOT NULL DEFAULT 0,
  opening_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "GiaoDich" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  account_id UUID NOT NULL REFERENCES "TaiKhoanTien"(id),
  business_date DATE NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  amount_vnd DECIMAL(19,4) NOT NULL CHECK (amount_vnd > 0),
  category_id UUID REFERENCES "HangMucNganSach"(id),
  status TEXT NOT NULL DEFAULT 'DRAFT',
  transfer_id UUID,
  reversal_of_id UUID REFERENCES "GiaoDich"(id),
  source_type TEXT,
  source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);

CREATE TABLE "KyKhoa" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  locked_by UUID NOT NULL REFERENCES "NguoiDung"(id),
  locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1
  -- Check for overlapping periods is done at application level
);

CREATE TABLE "ThanhToan" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  transaction_id UUID NOT NULL REFERENCES "GiaoDich"(id),
  receivable_id UUID REFERENCES "PhaiThu"(id),
  payable_id UUID REFERENCES "PhaiTra"(id),
  amount_vnd DECIMAL(19,4) NOT NULL CHECK (amount_vnd > 0),
  status TEXT NOT NULL DEFAULT 'DRAFT',
  reversal_of_id UUID REFERENCES "ThanhToan"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  CHECK (
    (receivable_id IS NOT NULL AND payable_id IS NULL) OR 
    (receivable_id IS NULL AND payable_id IS NOT NULL)
  )
);
