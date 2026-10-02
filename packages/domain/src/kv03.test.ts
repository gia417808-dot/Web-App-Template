import { test } from 'node:test';
import assert from 'node:assert';
import { kv03Domain, DonMua, KV03Error } from './kv03';

test('KV03 Domain Logic', async (t) => {
  const baseDonMua: DonMua = {
    id: '1', organization_id: 'org1', yeu_cau_id: null,
    san_pham_id: 'sp1', ma_don: 'PO-001', trang_thai: 'DRAFT',
    luong_dat: 100, luong_nhan_hop_le: 0, chenh_lech_nhan: 100,
    row_version: 1
  };

  await t.test('tinhChenhLech', () => {
    assert.strictEqual(kv03Domain.tinhChenhLech(100, 40), 60);
    assert.strictEqual(kv03Domain.tinhChenhLech(100, 120), -20);
  });

  await t.test('changeStatus transitions', () => {
    const draft = { ...baseDonMua };
    const approved = kv03Domain.changeStatus(draft, 'APPROVED');
    assert.strictEqual(approved.trang_thai, 'APPROVED');

    assert.throws(() => kv03Domain.changeStatus(draft, 'ORDERED'), KV03Error);
  });

  await t.test('datMuaHang requires APPROVED status', () => {
    const approved = { ...baseDonMua, trang_thai: 'APPROVED' as any };
    const ordered = kv03Domain.datMuaHang(approved);
    assert.strictEqual(ordered.trang_thai, 'ORDERED');
    assert.strictEqual(ordered.chenh_lech_nhan, 100);

    const draft = { ...baseDonMua };
    assert.throws(() => kv03Domain.datMuaHang(draft), KV03Error);
  });

  await t.test('nhanHang updates values and transitions correctly', () => {
    const ordered = { ...baseDonMua, trang_thai: 'ORDERED' as any, luong_dat: 100, luong_nhan_hop_le: 0 };
    
    const part = kv03Domain.nhanHang(ordered, 40);
    assert.strictEqual(part.trang_thai, 'PARTIALLY_RECEIVED');
    assert.strictEqual(part.luong_nhan_hop_le, 40);
    assert.strictEqual(part.chenh_lech_nhan, 60);

    const full = kv03Domain.nhanHang(part, 60);
    assert.strictEqual(full.trang_thai, 'RECEIVED');
    assert.strictEqual(full.luong_nhan_hop_le, 100);
    assert.strictEqual(full.chenh_lech_nhan, 0);

    const over = kv03Domain.nhanHang(ordered, 120);
    assert.strictEqual(over.trang_thai, 'RECEIVED');
    assert.strictEqual(over.chenh_lech_nhan, -20);
  });
});
