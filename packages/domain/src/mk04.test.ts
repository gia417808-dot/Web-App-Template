import { test } from 'node:test';
import assert from 'node:assert';
import { mk04Domain, MK04Error } from './mk04';

test('MK04 Domain Logic', async (t) => {
  await t.test('calculateCPL returns null if valid_leads <= 0', () => {
    assert.strictEqual(mk04Domain.calculateCPL(1000, 0), null);
    assert.strictEqual(mk04Domain.calculateCPL(1000, -1), null);
  });

  await t.test('calculateCPL computes correct CPL', () => {
    assert.strictEqual(mk04Domain.calculateCPL(100000, 5), 20000);
  });

  await t.test('tongHopKenh creates new record', () => {
    const record = mk04Domain.tongHopKenh('chan1', '2026-01-01', '2026-01-31', 50000, 2);
    assert.strictEqual(record.status, 'DRAFT');
    assert.strictEqual(record.cpl_vnd, 25000);
    assert.strictEqual(record.revision, 1);
  });

  await t.test('tongHopKenh updates existing non-locked record and sets to DRAFT', () => {
    const existing: any = { status: 'VERIFIED', revision: 1, row_version: 1 };
    const record = mk04Domain.tongHopKenh('chan1', '2026-01-01', '2026-01-31', 60000, 2, existing);
    assert.strictEqual(record.status, 'DRAFT');
    assert.strictEqual(record.cpl_vnd, 30000);
    assert.strictEqual(record.revision, 2);
    assert.strictEqual(record.row_version, 2);
  });

  await t.test('tongHopKenh throws if existing record is LOCKED', () => {
    const existing: any = { status: 'LOCKED' };
    assert.throws(() => mk04Domain.tongHopKenh('chan1', '2026-01-01', '2026-01-31', 60000, 2, existing), MK04Error);
  });

  await t.test('changeStatus allows DRAFT -> VERIFIED -> LOCKED', () => {
    let record: any = { status: 'DRAFT', row_version: 1 };
    record = mk04Domain.changeStatus(record, 'VERIFIED');
    assert.strictEqual(record.status, 'VERIFIED');
    
    record = mk04Domain.changeStatus(record, 'LOCKED');
    assert.strictEqual(record.status, 'LOCKED');
  });

  await t.test('changeStatus blocks invalid transitions', () => {
    const record: any = { status: 'DRAFT', row_version: 1 };
    assert.throws(() => mk04Domain.changeStatus(record, 'LOCKED'), MK04Error);
  });
});
