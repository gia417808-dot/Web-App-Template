ALTER TABLE "CongDoan" 
ADD COLUMN IF NOT EXISTS trong_so DECIMAL(19,4) NOT NULL DEFAULT 1 CHECK (trong_so >= 0),
ADD COLUMN IF NOT EXISTS ty_le_dat DECIMAL(5,4) NOT NULL DEFAULT 0 CHECK (ty_le_dat >= 0 AND ty_le_dat <= 1);

-- Bỏ check constraint cũ của trang_thai và thêm cái mới
ALTER TABLE "CongDoan" DROP CONSTRAINT IF EXISTS "CongDoan_trang_thai_check";
-- Update existing to map to new states
UPDATE "CongDoan" SET trang_thai = 'IN_PROGRESS' WHERE trang_thai = 'DOING';
UPDATE "CongDoan" SET trang_thai = 'COMPLETED' WHERE trang_thai = 'DONE';
ALTER TABLE "CongDoan" ADD CONSTRAINT "CongDoan_trang_thai_check" CHECK (trang_thai IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'));

CREATE TABLE IF NOT EXISTS "NhatKySX" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  cong_doan_id UUID NOT NULL REFERENCES "CongDoan"(id) ON DELETE CASCADE,
  ty_le_dat_truoc DECIMAL(5,4) NOT NULL,
  ty_le_dat_sau DECIMAL(5,4) NOT NULL,
  trang_thai_truoc TEXT NOT NULL,
  trang_thai_sau TEXT NOT NULL,
  ghi_chu TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
