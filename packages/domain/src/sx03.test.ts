import { test } from 'node:test';
import assert from 'node:assert';
import { sx03Domain, CongDoan, SX03Error } from './sx03';

test('SX03 Domain Logic', async (t) => {
  const cd: CongDoan = {
    id: 'cd1', organization_id: 'org1', lenh_san_xuat_id: 'lsx1', ten_cong_doan: 'Cắt',
    trong_so: 2, ty_le_dat: 0, trang_thai: 'PENDING', row_version: 1
  };

  await t.test('capNhatTienDo works', () => {
    const res = sx03Domain.capNhatTienDo(cd, 0.5, 'IN_PROGRESS', 'Dang lam');
    assert.strictEqual(res.updatedCd.ty_le_dat, 0.5);
    assert.strictEqual(res.updatedCd.trang_thai, 'IN_PROGRESS');
    assert.strictEqual(res.nhatKy.ghi_chu, 'Dang lam');
  });

  await t.test('capNhatTienDo limits 0 to 1', () => {
    assert.throws(() => sx03Domain.capNhatTienDo(cd, 1.5), SX03Error);
  });
  
  await t.test('tinhTienDoTong', () => {
    const cd2: CongDoan = { ...cd, id: 'cd2', trong_so: 3, ty_le_dat: 0.8 };
    const cd3: CongDoan = { ...cd, id: 'cd3', trong_so: 5, ty_le_dat: 1 };
    // sumW = 10. sumWP = 0*2 + 0.8*3 + 1*5 = 0 + 2.4 + 5 = 7.4
    // 7.4 / 10 = 0.74
    const total = sx03Domain.tinhTienDoTong([{...cd}, cd2, cd3]);
    assert.strictEqual(total, 0.74);
  });
});
