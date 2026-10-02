import { test } from 'node:test';
import assert from 'node:assert';
import { ns03Domain, DonNghi, SoDuPhep, NS03Error } from './ns03';

test('NS03 Domain Logic', async (t) => {
  const soDu: SoDuPhep = {
    id: 'sd1', organization_id: 'org1', nhan_su_id: 'ns1', nam: 2026,
    phep_dau_ky: 0, phep_phat_sinh: 12, phep_da_duyet: 2, phep_con_lai: 10, row_version: 1
  };

  const donNghi: DonNghi = {
    id: 'dn1', organization_id: 'org1', nhan_su_id: 'ns1',
    ngay_bat_dau: '2026-10-10', ngay_ket_thuc: '2026-10-12', so_ngay_nghi: 3,
    trang_thai: 'SUBMITTED', row_version: 1
  };

  await t.test('duyetNghiPhep deducts balance', () => {
    const res = ns03Domain.duyetNghiPhep(donNghi, soDu);
    assert.strictEqual(res.donNghi.trang_thai, 'APPROVED');
    assert.strictEqual(res.soDu.phep_da_duyet, 5);
    assert.strictEqual(res.soDu.phep_con_lai, 7);
  });

  await t.test('duyetNghiPhep throws if insufficient balance', () => {
    const poorBalance = { ...soDu, phep_con_lai: 1 };
    assert.throws(() => ns03Domain.duyetNghiPhep(donNghi, poorBalance), NS03Error);
  });

  await t.test('huyNghiPhep refunds balance', () => {
    const approvedDon = { ...donNghi, trang_thai: 'APPROVED' as any };
    const res = ns03Domain.huyNghiPhep(approvedDon, soDu);
    
    assert.strictEqual(res.donNghi.trang_thai, 'CANCELED');
    // soDu has da_duyet = 2. Refund 3? Will max with 0
    assert.strictEqual(res.soDu.phep_da_duyet, 0); 
    assert.strictEqual(res.soDu.phep_con_lai, 12);
  });

  await t.test('changeStatus transitions', () => {
    const draft = { ...donNghi, trang_thai: 'DRAFT' as any };
    const submitted = ns03Domain.changeStatus(draft, 'SUBMITTED');
    assert.strictEqual(submitted.trang_thai, 'SUBMITTED');
  });
});
