import { test } from 'node:test';
import assert from 'node:assert';
import { ns05Domain, UngVien, NS05Error } from './ns05';

test('NS05 Domain Logic', async (t) => {
  const ungVien: UngVien = {
    id: 'uv1', organization_id: 'org1', ho_ten: 'Nguyen Van A',
    vi_tri_ung_tuyen: 'Dev', ngay_mo_vi_tri: '2026-10-01',
    ngay_nhan_viec: null, thoi_gian_tuyen: null,
    trang_thai: 'OFFERED', row_version: 1
  };

  await t.test('chuyenVongTuyen HIRED valid', () => {
    const res = ns05Domain.chuyenVongTuyen(ungVien, 'HIRED', '2026-10-11');
    assert.strictEqual(res.trang_thai, 'HIRED');
    assert.strictEqual(res.thoi_gian_tuyen, 10);
  });

  await t.test('chuyenVongTuyen HIRED invalid date', () => {
    assert.throws(() => ns05Domain.chuyenVongTuyen(ungVien, 'HIRED', '2026-09-01'), NS05Error);
  });

  await t.test('chuyenVongTuyen block invalid transition', () => {
    assert.throws(() => ns05Domain.chuyenVongTuyen(ungVien, 'APPLIED'), NS05Error);
  });
  
  await t.test('chuyenVongTuyen needs date if HIRED', () => {
    assert.throws(() => ns05Domain.chuyenVongTuyen(ungVien, 'HIRED'), NS05Error);
  });
});
