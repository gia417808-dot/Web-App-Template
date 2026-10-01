CREATE TABLE IF NOT EXISTS NguonLead (
    id TEXT PRIMARY KEY,
    ten_nguon TEXT NOT NULL,
    mo_ta TEXT,
    organization_id TEXT NOT NULL DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS Lead (
    id TEXT PRIMARY KEY,
    nguon_id TEXT REFERENCES NguonLead(id),
    ten_lead TEXT NOT NULL,
    so_dien_thoai TEXT,
    trang_thai TEXT NOT NULL CHECK (trang_thai IN ('new', 'qualified', 'converted', 'invalid')) DEFAULT 'new',
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_chuyen_doi TIMESTAMP,
    duplicate_of TEXT REFERENCES Lead(id),
    version INTEGER NOT NULL DEFAULT 1,
    organization_id TEXT NOT NULL DEFAULT 'default'
);
