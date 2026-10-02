import { test } from 'node:test';
import assert from 'node:assert';
import { sx02Domain, DinhMuc, SX02Error } from './sx02';

test('SX02 Domain Logic', async (t) => {
  const dinhMuc: DinhMuc = {
    id: 'dm1', organization_id: 'org1', san_pham_ma: 'SP01', vat_tu_id: 'vt1',
    so_luong_dinh_muc: 2.5, ty_le_hao_hut: 10, trang_thai: 'APPROVED', row_version: 1
  };

  await t.test('duTruVatTu calculates correctly', () => {
    // 2.5 * 100 * 1.1 = 275
    const res = sx02Domain.duTruVatTu(dinhMuc, 100);
    assert.strictEqual(res.luong_can, 275);
  });

  await t.test('duTruVatTu blocks if not APPROVED', () => {
    const draft = { ...dinhMuc, trang_thai: 'DRAFT' as any };
    assert.throws(() => sx02Domain.duTruVatTu(draft, 100), SX02Error);
  });

  await t.test('changeStatus transitions', () => {
    const res = sx02Domain.changeStatus(dinhMuc, 'ARCHIVED');
    assert.strictEqual(res.trang_thai, 'ARCHIVED');
  });

  await t.test('changeStatus invalid', () => {
    assert.throws(() => sx02Domain.changeStatus(dinhMuc, 'DRAFT'), SX02Error);
  });
});
