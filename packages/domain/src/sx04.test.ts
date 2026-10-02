import { test } from 'node:test';
import assert from 'node:assert';
import { sx04Domain, PhieuKiem, SX04Error } from './sx04';

test('SX04 Domain Logic', async (t) => {
  const phieu: PhieuKiem = {
    id: 'p1', organization_id: 'org1', lenh_san_xuat_id: 'lsx1',
    so_luong_kiem: 0, so_luong_loi: 0, ty_le_loi: null, trang_thai: 'DRAFT', row_version: 1
  };

  await t.test('ghiNhanLoi works', () => {
    const res = sx04Domain.ghiNhanLoi(phieu, 100, 5);
    assert.strictEqual(res.so_luong_kiem, 100);
    assert.strictEqual(res.so_luong_loi, 5);
    assert.strictEqual(res.ty_le_loi, 0.05);
    assert.strictEqual(res.trang_thai, 'INSPECTED');
  });

  await t.test('ghiNhanLoi blocks duplicate counting', () => {
    assert.throws(() => sx04Domain.ghiNhanLoi(phieu, 100, 101), SX04Error);
  });

  await t.test('ghiNhanLoi blocks zero inspect', () => {
    assert.throws(() => sx04Domain.ghiNhanLoi(phieu, 0, 0), SX04Error);
  });

  await t.test('changeStatus transitions', () => {
    const inspected = { ...phieu, trang_thai: 'INSPECTED' as any };
    const res = sx04Domain.changeStatus(inspected, 'APPROVED');
    assert.strictEqual(res.trang_thai, 'APPROVED');
  });

  await t.test('changeStatus blocks invalid', () => {
    assert.throws(() => sx04Domain.changeStatus(phieu, 'APPROVED'), SX04Error);
  });
});
