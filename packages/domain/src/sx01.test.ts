import { test } from 'node:test';
import assert from 'node:assert';
import { sx01Domain, LenhSanXuat, SX01Error } from './sx01';

test('SX01 Domain Logic', async (t) => {
  const lenh: LenhSanXuat = {
    id: 'l1', organization_id: 'org1', ma_lenh: 'LSX01', san_pham_ma: 'SP01',
    luong_ke_hoach: 100, luong_dat: 0, luong_loi: 0, ty_le_hoan_thanh: 0,
    trang_thai: 'DRAFT', row_version: 1
  };

  await t.test('phatHanhLenh requires planned > 0', () => {
    const res = sx01Domain.phatHanhLenh(lenh);
    assert.strictEqual(res.trang_thai, 'RELEASED');
  });

  await t.test('phatHanhLenh block invalid qty', () => {
    const invalid = { ...lenh, luong_ke_hoach: 0 };
    assert.throws(() => sx01Domain.phatHanhLenh(invalid), SX01Error);
  });

  await t.test('ghiNhanSanLuong calculates percentages', () => {
    const released = { ...lenh, trang_thai: 'RELEASED' as any };
    const ghiNhan = sx01Domain.ghiNhanSanLuong(released, 50, 5);
    
    assert.strictEqual(ghiNhan.trang_thai, 'IN_PROGRESS');
    assert.strictEqual(ghiNhan.luong_dat, 50);
    assert.strictEqual(ghiNhan.luong_loi, 5);
    assert.strictEqual(ghiNhan.ty_le_hoan_thanh, 0.5000); // 50 / 100
  });

  await t.test('changeStatus blocks invalid', () => {
    assert.throws(() => sx01Domain.changeStatus(lenh, 'COMPLETED'), SX01Error);
  });
});
