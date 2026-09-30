CREATE TABLE "MucTieu" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  owner_id UUID NOT NULL REFERENCES "NguoiDung"(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  target_vnd DECIMAL(19,4) NOT NULL CHECK (target_vnd > 0),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'CLOSED')),
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version INTEGER NOT NULL DEFAULT 1,
  CHECK (period_start <= period_end)
);
