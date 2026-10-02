import { test } from 'node:test';
import assert from 'node:assert';
import { ns01Domain, NhanSu, NS01Error } from './ns01';

test('NS01 Domain Logic', async (t) => {
  const nsBase: NhanSu = {
    id: 'nv1', organization_id: 'org1', ma_nhan_vien: 'NV-01', ho_ten: 'Nguyen Van A',
    ngay_vao_lam: '2020-01-01', tham_nien_ngay: 0, trang_thai: 'ACTIVE', row_version: 1
  };

  await t.test('capNhatHoSo calculates seniority correctly', () => {
    // Giả lập current date là 2026-10-02
    const currentDate = new Date('2026-10-02T12:00:00Z');
    const res = ns01Domain.capNhatHoSo(nsBase, 'Nguyen Van A Updated', '2026-10-01', currentDate);
    assert.strictEqual(res.ho_ten, 'Nguyen Van A Updated');
    assert.strictEqual(res.ngay_vao_lam, '2026-10-01');
    assert.strictEqual(res.tham_nien_ngay, 1);
  });

  await t.test('capNhatHoSo rejects future dates', () => {
    const currentDate = new Date('2026-10-02T12:00:00Z');
    assert.throws(() => {
      ns01Domain.capNhatHoSo(nsBase, 'Nguyen Van B', '2026-10-05', currentDate);
    }, NS01Error);
  });

  await t.test('changeStatus transitions', () => {
    const inactive = ns01Domain.changeStatus(nsBase, 'INACTIVE');
    assert.strictEqual(inactive.trang_thai, 'INACTIVE');
    const active = ns01Domain.changeStatus(inactive, 'ACTIVE');
    assert.strictEqual(active.trang_thai, 'ACTIVE');
  });
});
