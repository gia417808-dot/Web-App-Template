import { test } from 'node:test';
import assert from 'node:assert';
import { mk05Domain, ThuNghiem, BienThe, MK05Error } from './mk05';

test('MK05 Domain Logic', async (t) => {
  const baseThuNghiem: ThuNghiem = {
    id: '1', organization_id: 'org1', noi_dung_id: 'nd1',
    ten_thu_nghiem: 'Test A/B', trang_thai: 'RUNNING',
    ngay_bat_dau: '2026-01-01', ngay_ket_thuc: null,
    revision: 1, row_version: 1
  };

  const baseBienThe1: BienThe = {
    id: 'v1', organization_id: 'org1', thu_nghiem_id: '1',
    ten_bien_the: 'Variant A', luot_tiep_can: 1000, phan_hoi: 50,
    ty_le_phan_hoi: null, revision: 1, row_version: 1
  };

  const baseBienThe2: BienThe = {
    id: 'v2', organization_id: 'org1', thu_nghiem_id: '1',
    ten_bien_the: 'Variant B', luot_tiep_can: 0, phan_hoi: 0,
    ty_le_phan_hoi: null, revision: 1, row_version: 1
  };

  await t.test('tinhTyLePhanHoi', () => {
    assert.strictEqual(mk05Domain.tinhTyLePhanHoi(50, 1000), 0.05);
    assert.strictEqual(mk05Domain.tinhTyLePhanHoi(10, 0), null);
    assert.strictEqual(mk05Domain.tinhTyLePhanHoi(10, -5), null);
  });

  await t.test('changeStatus blocks invalid', () => {
    const draft = { ...baseThuNghiem, trang_thai: 'DRAFT' as any };
    assert.throws(() => mk05Domain.changeStatus(draft, 'COMPLETED'), MK05Error);
    
    const locked = { ...baseThuNghiem, trang_thai: 'COMPLETED' as any };
    assert.throws(() => mk05Domain.changeStatus(locked, 'RUNNING'), MK05Error);
  });

  await t.test('chotThuNghiem updates variants and sets status to COMPLETED', () => {
    const { thuNghiem, bienTheList } = mk05Domain.chotThuNghiem(baseThuNghiem, [baseBienThe1, baseBienThe2]);
    assert.strictEqual(thuNghiem.trang_thai, 'COMPLETED');
    assert.strictEqual(bienTheList[0].ty_le_phan_hoi, 0.05);
    assert.strictEqual(bienTheList[1].ty_le_phan_hoi, null);
  });

  await t.test('chotThuNghiem fails if not RUNNING', () => {
    const draft = { ...baseThuNghiem, trang_thai: 'DRAFT' as any };
    assert.throws(() => mk05Domain.chotThuNghiem(draft, []), MK05Error);
  });
});
