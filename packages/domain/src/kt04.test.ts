import { test } from 'node:test';
import assert from 'node:assert';
import { kt04Domain, NganSach, KT04Error } from './kt04';

test('KT04 Domain Logic', async (t) => {
  const nsBase: NganSach = {
    id: 'ns1', organization_id: 'org1', hang_muc_id: 'hm1', ma_ngan_sach: 'NS-01',
    ky_ngan_sach: '2026-01', du_toan: 1000, thuc_chi: 0, chenh_lech: 1000,
    trang_thai: 'DRAFT', revision: 1, row_version: 1
  };

  await t.test('kiemSoatVuotChi updates diff', () => {
    const res = kt04Domain.kiemSoatVuotChi(nsBase, 300);
    assert.strictEqual(res.thuc_chi, 300);
    assert.strictEqual(res.chenh_lech, 700);
  });

  await t.test('kiemSoatVuotChi allows negative diff (vuot chi)', () => {
    const res = kt04Domain.kiemSoatVuotChi(nsBase, 1200);
    assert.strictEqual(res.thuc_chi, 1200);
    assert.strictEqual(res.chenh_lech, -200);
  });

  await t.test('kiemSoatVuotChi blocks LOCKED', () => {
    assert.throws(() => {
      kt04Domain.kiemSoatVuotChi({ ...nsBase, trang_thai: 'LOCKED' }, 100);
    }, KT04Error);
  });

  await t.test('changeStatus transitions', () => {
    const approved = kt04Domain.changeStatus(nsBase, 'APPROVED');
    assert.strictEqual(approved.trang_thai, 'APPROVED');
    
    assert.throws(() => kt04Domain.changeStatus(nsBase, 'LOCKED'), KT04Error);
  });

  await t.test('reviseNganSach updates budget and revision', () => {
    const res = kt04Domain.reviseNganSach(nsBase, 2000);
    assert.strictEqual(res.du_toan, 2000);
    assert.strictEqual(res.chenh_lech, 2000);
    assert.strictEqual(res.revision, 2);
  });
});
