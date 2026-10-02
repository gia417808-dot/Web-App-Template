import { test } from 'node:test';
import assert from 'node:assert';
import { kt02Domain, PhaiThu, ThanhToanPhaiThu, KT02Error } from './kt02';

test('KT02 Domain Logic', async (t) => {
  const phaiThuBase: PhaiThu = {
    id: 'pt1', organization_id: 'org1', khach_hang_id: 'kh1', ma_phai_thu: 'PT-01',
    so_goc: 1000, da_thanh_toan: 0, con_lai: 1000, trang_thai: 'OPEN',
    han_thanh_toan: '2026-01-31', row_version: 1
  };

  await t.test('xacDinhTrangThai correctness', () => {
    assert.strictEqual(kt02Domain.xacDinhTrangThai(0, 1000), 'OPEN');
    assert.strictEqual(kt02Domain.xacDinhTrangThai(500, 1000), 'PARTIALLY_PAID');
    assert.strictEqual(kt02Domain.xacDinhTrangThai(1000, 1000), 'SETTLED');
    assert.strictEqual(kt02Domain.xacDinhTrangThai(1200, 1000), 'OVERPAID');
  });

  await t.test('doiSoatThu partial payment', () => {
    const tt: ThanhToanPhaiThu = {
      id: 'tt1', organization_id: 'org1', phai_thu_id: 'pt1', so_tien: 300,
      ngay_thanh_toan: '2026-01-10', trang_thai: 'DRAFT', row_version: 1
    };

    const res = kt02Domain.doiSoatThu(phaiThuBase, tt);
    assert.strictEqual(res.phaiThu.da_thanh_toan, 300);
    assert.strictEqual(res.phaiThu.con_lai, 700);
    assert.strictEqual(res.phaiThu.trang_thai, 'PARTIALLY_PAID');
    assert.strictEqual(res.thanhToan.trang_thai, 'CONFIRMED');
  });

  await t.test('doiSoatThu overpayment creates exception', () => {
    const tt: ThanhToanPhaiThu = {
      id: 'tt2', organization_id: 'org1', phai_thu_id: 'pt1', so_tien: 1500,
      ngay_thanh_toan: '2026-01-10', trang_thai: 'DRAFT', row_version: 1
    };

    const res = kt02Domain.doiSoatThu(phaiThuBase, tt);
    assert.strictEqual(res.phaiThu.con_lai, -500);
    assert.strictEqual(res.phaiThu.trang_thai, 'OVERPAID');
  });

  await t.test('doiSoatThu validates state', () => {
    const ttConfirmed: ThanhToanPhaiThu = {
      id: 'tt3', organization_id: 'org1', phai_thu_id: 'pt1', so_tien: 300,
      ngay_thanh_toan: '2026-01-10', trang_thai: 'CONFIRMED', row_version: 1
    };

    assert.throws(() => kt02Domain.doiSoatThu(phaiThuBase, ttConfirmed), KT02Error);
  });
});
