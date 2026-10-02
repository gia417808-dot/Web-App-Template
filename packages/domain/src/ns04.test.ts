import { test } from 'node:test';
import assert from 'node:assert';
import { ns04Domain, BangLuong, KhoanDieuChinh, NS04Error } from './ns04';

test('NS04 Domain Logic', async (t) => {
  const baseLuon: BangLuong = {
    id: 'bl1', organization_id: 'org1', ky_luong: '2026-10', nhan_su_id: 'ns1',
    luong_thoa_thuan: 10000000, tong_phu_cap: 0, tong_khau_tru: 0, thuc_nhan: 10000000,
    trang_thai: 'DRAFT', row_version: 1
  };

  await t.test('tinhThucNhan sum allowances and deductions', () => {
    const dieuChinhs: KhoanDieuChinh[] = [
      { loai_dieu_chinh: 'PHU_CAP', so_tien: 2000000 },
      { loai_dieu_chinh: 'KHAU_TRU', so_tien: 500000 }
    ];

    const res = ns04Domain.tinhThucNhan(10000000, dieuChinhs);
    assert.strictEqual(res.tongPhuCap, 2000000);
    assert.strictEqual(res.tongKhauTru, 500000);
    assert.strictEqual(res.thucNhan, 11500000);
  });

  await t.test('chotBangLuong requires REVIEWED', () => {
    assert.throws(() => ns04Domain.chotBangLuong(baseLuon), NS04Error);
    
    const reviewed = { ...baseLuon, trang_thai: 'REVIEWED' as any };
    const locked = ns04Domain.chotBangLuong(reviewed);
    assert.strictEqual(locked.trang_thai, 'LOCKED');
  });

  await t.test('changeStatus blocks invalid', () => {
    const locked = { ...baseLuon, trang_thai: 'LOCKED' as any };
    assert.throws(() => ns04Domain.changeStatus(locked, 'REVIEWED'), NS04Error);
  });
});
