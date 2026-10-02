import { test } from 'node:test';
import assert from 'node:assert';
import { kt05Domain, KT05Error, LaiGopDonHang } from './kt05';

test('KT05 Domain Logic', async (t) => {
  await t.test('tinhLaiGop with complete costs', () => {
    const lines = [
      { chi_tiet_don_id: 'l1', doanh_thu: 1000, gia_von: 800 },
      { chi_tiet_don_id: 'l2', doanh_thu: 2000, gia_von: 1500 }
    ];

    const res = kt05Domain.tinhLaiGop('org1', 'dh1', lines);
    
    assert.strictEqual(res.doanh_thu_thuan, 3000);
    assert.strictEqual(res.tong_gia_von, 2300);
    assert.strictEqual(res.lai_gop, 700);
    assert.strictEqual(res.trang_thai, 'CALCULATED');
    assert.strictEqual(res.chi_tiet[0].lai_gop, 200);
    assert.strictEqual(res.chi_tiet[1].lai_gop, 500);
  });

  await t.test('tinhLaiGop with missing costs', () => {
    const lines = [
      { chi_tiet_don_id: 'l1', doanh_thu: 1000, gia_von: 800 },
      { chi_tiet_don_id: 'l2', doanh_thu: 2000, gia_von: null }
    ];

    const res = kt05Domain.tinhLaiGop('org1', 'dh1', lines);
    
    assert.strictEqual(res.doanh_thu_thuan, 3000);
    assert.strictEqual(res.tong_gia_von, null);
    assert.strictEqual(res.lai_gop, null);
    assert.strictEqual(res.trang_thai, 'MISSING_COST');
    assert.strictEqual(res.chi_tiet[1].lai_gop, null);
  });

  await t.test('changeStatus blocks REVIEWED when MISSING_COST', () => {
    const base: LaiGopDonHang = {
      id: 'lg1', organization_id: 'org1', don_hang_id: 'dh1',
      doanh_thu_thuan: 1000, tong_gia_von: null, lai_gop: null,
      trang_thai: 'MISSING_COST', row_version: 1, chi_tiet: []
    };

    assert.throws(() => kt05Domain.changeStatus(base, 'REVIEWED'), KT05Error);
  });
});
