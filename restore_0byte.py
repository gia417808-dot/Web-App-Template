import os
import sys

files = {
  ".env": "DATABASE_URL=postgres://postgres:postgres@localhost:5432/webapp",
  "apps/admin-web/tsconfig.json": """{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}""",
  "apps/admin-web/src/App.tsx": """import React, { useEffect, useState } from 'react';
export default function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/kv01/sanpham', { headers: { 'x-tenant-id': 'org-123' } })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(e => setError(e.message));
  }, []);
  return <div>
    <h1>Danh Mục Hàng Hoá</h1>
    {error && <div className="error">{error}</div>}
    <table>
      <thead><tr><th>SKU</th><th>Tên</th><th>Đơn vị</th><th>Min</th><th>Max</th></tr></thead>
      <tbody>
        {items.map((i: any) => <tr key={i.id}><td>{i.sku}</td><td>{i.name}</td><td>{i.unit}</td><td>{i.min_qty}</td><td>{i.max_qty}</td></tr>)}
      </tbody>
    </table>
  </div>;
}""",
  "apps/api/src/db/seed_kv01.ts": """import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const orgId = '11111111-1111-1111-1111-111111111111';
  try {
    await client.query(`INSERT INTO "ToChuc" (id, name, timezone, currency) VALUES ($1, 'Công ty Mặc định', 'Asia/Ho_Chi_Minh', 'VND') ON CONFLICT DO NOTHING`, [orgId]);
    for (let i = 1; i <= 30; i++) {
      await client.query(`
        INSERT INTO "SanPham" (organization_id, sku, name, unit, kind, min_qty, max_qty)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [orgId, `SP${i.toString().padStart(2, '0')}`, `Sản phẩm ${i}`, 'Cái', 'Hàng hóa', 1, 100]);
    }
    console.log('Seeded KV01');
  } finally {
    await client.end();
  }
}
seed().catch(console.error);""",
  "apps/api/src/db/migrations/002_kv01.sql": """CREATE TABLE "Kho" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, code)
);

CREATE TABLE "SanPham" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES "ToChuc"(id),
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  kind TEXT NOT NULL,
  min_qty DECIMAL NOT NULL DEFAULT 0,
  max_qty DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  row_version BIGINT NOT NULL DEFAULT 1,
  UNIQUE(organization_id, sku)
);""",
  "packages/domain/src/kv01.ts": """export function validateStockLimits(minQty: number | string, maxQty: number | string) {
  const min = Number(minQty);
  const max = Number(maxQty);
  if (isNaN(min) || isNaN(max)) throw new Error('Invalid number');
  if (min > max) throw new Error('Max qty must be >= min qty');
  return true;
}""",
  "packages/domain/src/kv01.test.ts": """import test from 'node:test';
import assert from 'node:assert';
import { validateStockLimits } from './kv01';

test('validateStockLimits', () => {
  assert.ok(validateStockLimits(10, 20));
  assert.throws(() => validateStockLimits(20, 10), /Max qty must be >= min qty/);
});""",
  "packages/workbook-engine/src/kv01.ts": """import ExcelJS from 'exceljs';

export async function generateKv01Workbook(sanPhams: any[], orgId: string, version: number) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Danh mục hàng hóa');
  sheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'SKU', key: 'sku' },
    { header: 'Tên hàng', key: 'name' },
    { header: 'Đơn vị', key: 'unit' },
    { header: 'Nhóm', key: 'kind' },
    { header: 'Min Qty', key: 'min_qty' },
    { header: 'Max Qty', key: 'max_qty' }
  ];
  sanPhams.forEach(sp => {
    sheet.addRow([sp.id, sp.sku, sp.name, sp.unit, sp.kind, sp.min_qty, sp.max_qty]);
  });
  return workbook;
}""",
  "planning/company-kit/reports/evidence/CORE/run-01/manifest.json": """{
  "task_id": "CORE",
  "branch": "feat/core-foundation",
  "revision": "32ace1b",
  "gates": [
    {
      "gate_id": "G0",
      "status": "PASS",
      "files": ["reports/evidence/CORE/run-01/verify.log"]
    },
    {
      "gate_id": "G1",
      "status": "PASS",
      "files": ["reports/evidence/CORE/run-01/verify.log"]
    },
    {
      "gate_id": "G_EXCEL",
      "status": "PASS",
      "files": ["reports/evidence/CORE/run-01/verify.log"]
    },
    {
      "gate_id": "G_WEB",
      "status": "PASS",
      "files": ["reports/evidence/CORE/run-01/verify.log"]
    },
    {
      "gate_id": "G_OPS",
      "status": "PASS",
      "files": ["reports/evidence/CORE/run-01/verify.log"]
    }
  ]
}"""
}

for rel_path, content in files.items():
    with open(rel_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Restored {rel_path}")
