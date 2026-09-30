CREATE TABLE "GiaiDoan" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  default_probability_pct DECIMAL(5,2) NOT NULL CHECK (default_probability_pct >= 0 AND default_probability_pct <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);

CREATE TABLE "KhachHang" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);

CREATE TABLE "Lead" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);

CREATE TABLE "CoHoi" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  customer_id UUID REFERENCES "KhachHang"(id),
  lead_id UUID REFERENCES "Lead"(id),
  stage_id UUID NOT NULL REFERENCES "GiaiDoan"(id),
  value_vnd DECIMAL(19,4) NOT NULL CHECK (value_vnd >= 0),
  probability_pct DECIMAL(5,2) NOT NULL CHECK (probability_pct >= 0 AND probability_pct <= 100),
  expected_close_date DATE,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'WON', 'LOST')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);
