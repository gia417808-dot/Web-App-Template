import { test } from 'node:test';
import assert from 'node:assert';
import { kv04Domain, DotKiemKe, KV04Error } from './kv04';

test('KV04 Domain Logic', async (t) => {
  const dotKiemKe: DotKiemKe = {
    id: '1', organization_id: 'org1', kho_id: 'kho1',
    ma_kiem_ke: 'KK-001', trang_thai: 'DRAFT',
    lines: [
      { id: 'L1', san_pham_id: 'SP1', ton_so: 100, dem_thuc_te: 0, lech: -100 }
    ],
    row_version: 1
  };

  await t.test('tinhLech calculates difference', () => {
    assert.strictEqual(kv04Domain.tinhLech(90, 100), -10);
    assert.strictEqual(kv04Domain.tinhLech(110, 100), 10);
  });

  await t.test('changeStatus respects workflow', () => {
    const counting = kv04Domain.changeStatus(dotKiemKe, 'COUNTING');
    assert.strictEqual(counting.trang_thai, 'COUNTING');
    assert.throws(() => kv04Domain.changeStatus(dotKiemKe, 'POSTED'), KV04Error);
  });

  await t.test('capNhatDong calculates lech only when COUNTING', () => {
    const counting = kv04Domain.changeStatus(dotKiemKe, 'COUNTING');
    const updated = kv04Domain.capNhatDong(counting, 'L1', 95);
    assert.strictEqual(updated.lines[0].dem_thuc_te, 95);
    assert.strictEqual(updated.lines[0].lech, -5);

    assert.throws(() => kv04Domain.capNhatDong(dotKiemKe, 'L1', 100), KV04Error);
  });

  await t.test('chotKiemKe requires REVIEWED status', () => {
    const counting = kv04Domain.changeStatus(dotKiemKe, 'COUNTING');
    const reviewed = kv04Domain.changeStatus(counting, 'REVIEWED');
    const posted = kv04Domain.chotKiemKe(reviewed);
    assert.strictEqual(posted.trang_thai, 'POSTED');

    assert.throws(() => kv04Domain.chotKiemKe(counting), KV04Error);
  });
});
