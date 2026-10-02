export type SX01Status = 'DRAFT' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface LenhSanXuat {
  id: string;
  organization_id: string;
  ma_lenh: string;
  san_pham_ma: string;
  luong_ke_hoach: number;
  luong_dat: number;
  luong_loi: number;
  ty_le_hoan_thanh: number;
  trang_thai: SX01Status;
  row_version: number;
}

export class SX01Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SX01Error';
  }
}

export const sx01Domain = {
  phatHanhLenh(lenh: LenhSanXuat): LenhSanXuat {
    if (lenh.trang_thai !== 'DRAFT') {
      throw new SX01Error(`Chỉ được phát hành lệnh từ DRAFT. Hiện tại: ${lenh.trang_thai}`);
    }
    
    if (lenh.luong_ke_hoach <= 0) {
      throw new SX01Error('Lượng kế hoạch phải lớn hơn 0 khi phát hành');
    }

    return {
      ...lenh,
      trang_thai: 'RELEASED',
      row_version: lenh.row_version + 1
    };
  },

  ghiNhanSanLuong(lenh: LenhSanXuat, themDat: number, themLoi: number): LenhSanXuat {
    if (lenh.trang_thai !== 'IN_PROGRESS' && lenh.trang_thai !== 'RELEASED') {
      throw new SX01Error(`Không thể ghi nhận sản lượng ở trạng thái ${lenh.trang_thai}`);
    }

    const luong_dat = lenh.luong_dat + themDat;
    const luong_loi = lenh.luong_loi + themLoi;
    const ty_le_hoan_thanh = Number((luong_dat / lenh.luong_ke_hoach).toFixed(4)); // Tỷ lệ dạng số thập phân, vd 0.5 = 50%

    return {
      ...lenh,
      luong_dat,
      luong_loi,
      ty_le_hoan_thanh,
      trang_thai: 'IN_PROGRESS', // Cứ có ghi nhận thì tự động IN_PROGRESS nếu đang RELEASED
      row_version: lenh.row_version + 1
    };
  },

  changeStatus(lenh: LenhSanXuat, newStatus: SX01Status): LenhSanXuat {
    const allowed: Record<SX01Status, SX01Status[]> = {
      'DRAFT': ['RELEASED', 'CANCELED'],
      'RELEASED': ['IN_PROGRESS', 'CANCELED'],
      'IN_PROGRESS': ['COMPLETED', 'CANCELED'],
      'COMPLETED': [],
      'CANCELED': []
    };

    if (!allowed[lenh.trang_thai].includes(newStatus)) {
      throw new SX01Error(`Không thể chuyển trạng thái từ ${lenh.trang_thai} sang ${newStatus}`);
    }

    return {
      ...lenh,
      trang_thai: newStatus,
      row_version: lenh.row_version + 1
    };
  }
};
