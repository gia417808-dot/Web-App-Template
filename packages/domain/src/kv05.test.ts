import { test } from 'node:test';
import assert from 'node:assert';
import { kv05Domain, CanhBaoBoSung, MucTonKho, KV05Error } from './kv05';

test('KV05 Domain Logic', async (t) => {
  const mucTon: MucTonKho = {
    id: 'm1', organization_id: 'org1', kho_id: 'k1', san_pham_id: 'sp1', ton_muc_tieu: 100
  };

  await t.test('tinhLuongGoiY correctly bounds to 0', () => {
    assert.strictEqual(kv05Domain.tinhLuongGoiY(100, 50), 50);
    assert.strictEqual(kv05Domain.tinhLuongGoiY(100, 120), 0);
  });

  await t.test('deXuatBoSung creates valid proposal', () => {
    const p = kv05Domain.deXuatBoSung(mucTon, 40);
    assert.strictEqual(p.luong_goi_y, 60);
    assert.strictEqual(p.trang_thai, 'OPEN');
  });

  await t.test('changeStatus transitions properly', () => {
    const cb: CanhBaoBoSung = {
      id: 'c1', organization_id: 'org1', muc_ton_id: 'm1',
      ton_kha_dung: 40, luong_goi_y: 60, trang_thai: 'OPEN', row_version: 1
    };

    const ack = kv05Domain.changeStatus(cb, 'ACKNOWLEDGED');
    assert.strictEqual(ack.trang_thai, 'ACKNOWLEDGED');

    assert.throws(() => kv05Domain.changeStatus(ack, 'OPEN'), KV05Error);
    
    const res = kv05Domain.changeStatus(ack, 'RESOLVED');
    assert.strictEqual(res.trang_thai, 'RESOLVED');
    assert.throws(() => kv05Domain.changeStatus(res, 'ACKNOWLEDGED'), KV05Error);
  });
});
