export type KV05Status = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface MucTonKho {
  id: string;
  organization_id: string;
  kho_id: string;
  san_pham_id: string;
  ton_muc_tieu: number;
}

export interface CanhBaoBoSung {
  id: string;
  organization_id: string;
  muc_ton_id: string;
  ton_kha_dung: number;
  luong_goi_y: number;
  trang_thai: KV05Status;
  row_version: number;
}

export class KV05Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KV05Error';
  }
}

export const kv05Domain = {
  tinhLuongGoiY(tonMucTieu: number, tonKhaDung: number): number {
    return Math.max(0, tonMucTieu - tonKhaDung);
  },

  deXuatBoSung(mucTon: MucTonKho, tonKhaDung: number): Omit<CanhBaoBoSung, 'id' | 'row_version'> {
    const luongGoiY = this.tinhLuongGoiY(mucTon.ton_muc_tieu, tonKhaDung);
    return {
      organization_id: mucTon.organization_id,
      muc_ton_id: mucTon.id,
      ton_kha_dung: tonKhaDung,
      luong_goi_y: luongGoiY,
      trang_thai: 'OPEN'
    };
  },

  changeStatus(canhBao: CanhBaoBoSung, newStatus: KV05Status): CanhBaoBoSung {
    const allowed: Record<KV05Status, KV05Status[]> = {
      'OPEN': ['ACKNOWLEDGED', 'RESOLVED'],
      'ACKNOWLEDGED': ['RESOLVED'],
      'RESOLVED': []
    };

    if (!allowed[canhBao.trang_thai].includes(newStatus)) {
      throw new KV05Error(`Không thể chuyển trạng thái từ ${canhBao.trang_thai} sang ${newStatus}`);
    }

    return {
      ...canhBao,
      trang_thai: newStatus,
      row_version: canhBao.row_version + 1
    };
  }
};
