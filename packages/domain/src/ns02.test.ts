import { test } from 'node:test';
import assert from 'node:assert';
import { ns02Domain, ChamCong, CaLam, NS02Error } from './ns02';

test('NS02 Domain Logic', async (t) => {
  const caLam: CaLam = {
    id: 'ca1', organization_id: 'org1', ma_ca: 'CA01',
    gio_vao: '22:00:00', gio_ra: '06:00:00', tru_gio_nghi: 1
  };

  const baseChamCong: ChamCong = {
    id: 'cc1', organization_id: 'org1', nhan_su_id: 'ns1', ca_lam_id: 'ca1',
    ngay_cham_cong: '2026-10-02', gio_vao_thuc_te: null, gio_ra_thuc_te: null,
    tong_gio_lam: null, trang_thai: 'SUBMITTED', row_version: 1
  };

  await t.test('tinhGioLam qua nua dem', () => {
    // 22h -> 6h is 8 hours, minus 1 hour break = 7 hours
    const res = ns02Domain.tinhGioLam('22:00', '06:00', 1);
    assert.strictEqual(res, 7);
  });

  await t.test('tinhGioLam fails if ambiguous', () => {
    assert.throws(() => ns02Domain.tinhGioLam('08:00', '08:00', 1), NS02Error);
  });

  await t.test('duyetChamCong populates thuc te with ca lam', () => {
    const res = ns02Domain.duyetChamCong(baseChamCong, caLam);
    assert.strictEqual(res.gio_vao_thuc_te, '22:00:00');
    assert.strictEqual(res.gio_ra_thuc_te, '06:00:00');
    assert.strictEqual(res.tong_gio_lam, 7);
    assert.strictEqual(res.trang_thai, 'APPROVED');
  });

  await t.test('changeStatus transitions', () => {
    const draft: ChamCong = { ...baseChamCong, trang_thai: 'DRAFT' };
    const submitted = ns02Domain.changeStatus(draft, 'SUBMITTED');
    assert.strictEqual(submitted.trang_thai, 'SUBMITTED');
    
    assert.throws(() => ns02Domain.changeStatus(draft, 'APPROVED'), NS02Error);
  });
});
