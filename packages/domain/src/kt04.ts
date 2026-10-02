export type KT04Status = 'DRAFT' | 'APPROVED' | 'LOCKED';

export interface NganSach {
  id: string;
  organization_id: string;
  hang_muc_id: string;
  ma_ngan_sach: string;
  ky_ngan_sach: string;
  du_toan: number;
  thuc_chi: number;
  chenh_lech: number;
  trang_thai: KT04Status;
  revision: number;
  row_version: number;
}

export class KT04Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KT04Error';
  }
}

export const kt04Domain = {
  kiemSoatVuotChi(nganSach: NganSach, thucChiMoi: number): NganSach {
    if (nganSach.trang_thai === 'LOCKED') {
      throw new KT04Error('Ngân sách đã bị khóa (LOCKED), không thể ghi nhận thêm thực chi');
    }

    const chenhLech = nganSach.du_toan - thucChiMoi;

    return {
      ...nganSach,
      thuc_chi: thucChiMoi,
      chenh_lech: chenhLech,
      row_version: nganSach.row_version + 1
    };
  },

  changeStatus(nganSach: NganSach, newStatus: KT04Status): NganSach {
    const allowed: Record<KT04Status, KT04Status[]> = {
      'DRAFT': ['APPROVED'],
      'APPROVED': ['DRAFT', 'LOCKED'],
      'LOCKED': []
    };

    if (!allowed[nganSach.trang_thai].includes(newStatus)) {
      throw new KT04Error(`Không thể chuyển trạng thái từ ${nganSach.trang_thai} sang ${newStatus}`);
    }

    return {
      ...nganSach,
      trang_thai: newStatus,
      row_version: nganSach.row_version + 1
    };
  },
  
  reviseNganSach(nganSach: NganSach, duToanMoi: number): NganSach {
    if (nganSach.trang_thai === 'LOCKED') {
      throw new KT04Error('Không thể điều chỉnh dự toán ngân sách đã bị khóa');
    }
    
    const chenhLech = duToanMoi - nganSach.thuc_chi;
    
    return {
      ...nganSach,
      du_toan: duToanMoi,
      chenh_lech: chenhLech,
      revision: nganSach.revision + 1,
      row_version: nganSach.row_version + 1
    };
  }
};
