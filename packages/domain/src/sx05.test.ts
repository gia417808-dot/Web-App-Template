import { test } from 'node:test';
import assert from 'node:assert';
import { sx05Domain, LenhSanXuatSX05, ChiPhiSX, SX05Error } from './sx05';

test('SX05 Domain Logic', async (t) => {
  const lenh: LenhSanXuatSX05 = {
    id: 'l1', organization_id: 'org1', ma_lenh: 'LSX1',
    luong_dat: 50, tong_chi_phi: 0, gia_thanh_don_vi: null, trang_thai_gia_thanh: 'DRAFT', row_version: 1
  };

  const cp1: ChiPhiSX = { id: 'c1', lenh_san_xuat_id: 'l1', loai_chi_phi: 'VAT_TU', so_tien: 1000, trang_thai: 'APPROVED' };
  const cp2: ChiPhiSX = { id: 'c2', lenh_san_xuat_id: 'l1', loai_chi_phi: 'NHAN_CONG', so_tien: 500, trang_thai: 'APPROVED' };
  const cp3: ChiPhiSX = { id: 'c3', lenh_san_xuat_id: 'l1', loai_chi_phi: 'KHAC', so_tien: 100, trang_thai: 'PENDING' };

  await t.test('tinhGiaThanh calculates correctly', () => {
    const res = sx05Domain.tinhGiaThanh(lenh, [cp1, cp2, cp3]);
    assert.strictEqual(res.tong_chi_phi, 1500); // Only approved
    assert.strictEqual(res.gia_thanh_don_vi, 30); // 1500 / 50
    assert.strictEqual(res.trang_thai_gia_thanh, 'CALCULATED');
  });

  await t.test('tinhGiaThanh handles zero luong_dat', () => {
    const lenh0 = { ...lenh, luong_dat: 0 };
    const res = sx05Domain.tinhGiaThanh(lenh0, [cp1]);
    assert.strictEqual(res.tong_chi_phi, 1000);
    assert.strictEqual(res.gia_thanh_don_vi, null);
  });

  await t.test('lockGiaThanh requires cost', () => {
    const calculated = { ...lenh, trang_thai_gia_thanh: 'CALCULATED' as any, tong_chi_phi: 0 };
    assert.throws(() => sx05Domain.lockGiaThanh(calculated), SX05Error);
  });

  await t.test('lockGiaThanh success', () => {
    const calculated = { ...lenh, trang_thai_gia_thanh: 'CALCULATED' as any, tong_chi_phi: 1500 };
    const res = sx05Domain.lockGiaThanh(calculated);
    assert.strictEqual(res.trang_thai_gia_thanh, 'LOCKED');
  });
});
