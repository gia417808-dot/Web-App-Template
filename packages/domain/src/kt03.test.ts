import { test } from 'node:test';
import assert from 'node:assert';
import { kt03Domain, PhaiTra, ThanhToanPhaiTra, KT03Error } from './kt03';

test('KT03 Domain Logic', async (t) => {
  const phaiTraBase: PhaiTra = {
    id: 'pt1', organization_id: 'org1', nha_cung_cap_id: 'ncc1', ma_phai_tra: 'PT-01',
    so_goc: 1000, da_thanh_toan: 0, con_lai: 1000, trang_thai: 'OPEN',
    han_thanh_toan: '2026-01-31', row_version: 1
  };

  await t.test('xacDinhTrangThai correctness', () => {
    assert.strictEqual(kt03Domain.xacDinhTrangThai(0, 1000), 'OPEN');
    assert.strictEqual(kt03Domain.xacDinhTrangThai(500, 1000), 'PARTIALLY_PAID');
    assert.strictEqual(kt03Domain.xacDinhTrangThai(1000, 1000), 'SETTLED');
    assert.strictEqual(kt03Domain.xacDinhTrangThai(1200, 1000), 'OVERPAID');
  });

  await t.test('doiSoatChi partial payment', () => {
    const tt: ThanhToanPhaiTra = {
      id: 'tt1', organization_id: 'org1', phai_tra_id: 'pt1', so_tien: 300,
      ngay_thanh_toan: '2026-01-10', trang_thai: 'DRAFT', row_version: 1
    };

    const res = kt03Domain.doiSoatChi(phaiTraBase, tt);
    assert.strictEqual(res.phaiTra.da_thanh_toan, 300);
    assert.strictEqual(res.phaiTra.con_lai, 700);
    assert.strictEqual(res.phaiTra.trang_thai, 'PARTIALLY_PAID');
    assert.strictEqual(res.thanhToan.trang_thai, 'CONFIRMED');
  });

  await t.test('doiSoatChi overpayment creates exception', () => {
    const tt: ThanhToanPhaiTra = {
      id: 'tt2', organization_id: 'org1', phai_tra_id: 'pt1', so_tien: 1500,
      ngay_thanh_toan: '2026-01-10', trang_thai: 'DRAFT', row_version: 1
    };

    const res = kt03Domain.doiSoatChi(phaiTraBase, tt);
    assert.strictEqual(res.phaiTra.con_lai, -500);
    assert.strictEqual(res.phaiTra.trang_thai, 'OVERPAID');
  });
});
