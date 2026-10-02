export type NS02Status = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface CaLam {
  id: string;
  organization_id: string;
  ma_ca: string;
  gio_vao: string; // HH:mm:ss
  gio_ra: string;  // HH:mm:ss
  tru_gio_nghi: number;
}

export interface ChamCong {
  id: string;
  organization_id: string;
  nhan_su_id: string;
  ca_lam_id: string;
  ngay_cham_cong: string;
  gio_vao_thuc_te: string | null;
  gio_ra_thuc_te: string | null;
  tong_gio_lam: number | null;
  trang_thai: NS02Status;
  row_version: number;
}

export class NS02Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NS02Error';
  }
}

export const ns02Domain = {
  _parseHours(timeStr: string): number {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) + parseInt(parts[1]) / 60 + (parts[2] ? parseInt(parts[2]) / 3600 : 0);
  },

  tinhGioLam(gioVao: string, gioRa: string, truGioNghi: number): number {
    const vao = this._parseHours(gioVao);
    const ra = this._parseHours(gioRa);

    if (vao === ra) {
      throw new NS02Error('AMBIGUOUS_SHIFT: Giờ vào và giờ ra bằng nhau');
    }

    let diff = ra - vao;
    if (diff < 0) {
      diff += 24; // Qua nửa đêm
    }

    const tongGio = diff - truGioNghi;
    return Number(Math.max(0, tongGio).toFixed(2));
  },

  duyetChamCong(chamCong: ChamCong, caLam: CaLam): ChamCong {
    if (chamCong.trang_thai !== 'SUBMITTED') {
      throw new NS02Error(`Chỉ được duyệt khi trạng thái là SUBMITTED, hiện tại là ${chamCong.trang_thai}`);
    }

    const vao = chamCong.gio_vao_thuc_te || caLam.gio_vao;
    const ra = chamCong.gio_ra_thuc_te || caLam.gio_ra;

    const tongGio = this.tinhGioLam(vao, ra, caLam.tru_gio_nghi);

    return {
      ...chamCong,
      gio_vao_thuc_te: vao,
      gio_ra_thuc_te: ra,
      tong_gio_lam: tongGio,
      trang_thai: 'APPROVED',
      row_version: chamCong.row_version + 1
    };
  },

  changeStatus(chamCong: ChamCong, newStatus: NS02Status): ChamCong {
    const allowed: Record<NS02Status, NS02Status[]> = {
      'DRAFT': ['SUBMITTED'],
      'SUBMITTED': ['APPROVED', 'REJECTED'],
      'APPROVED': [],
      'REJECTED': ['DRAFT']
    };

    if (!allowed[chamCong.trang_thai].includes(newStatus)) {
      throw new NS02Error(`Không thể chuyển trạng thái từ ${chamCong.trang_thai} sang ${newStatus}`);
    }

    return {
      ...chamCong,
      trang_thai: newStatus,
      row_version: chamCong.row_version + 1
    };
  }
};
