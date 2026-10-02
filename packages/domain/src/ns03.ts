export type NS03Status = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELED';

export interface SoDuPhep {
  id: string;
  organization_id: string;
  nhan_su_id: string;
  nam: number;
  phep_dau_ky: number;
  phep_phat_sinh: number;
  phep_da_duyet: number;
  phep_con_lai: number;
  row_version: number;
}

export interface DonNghi {
  id: string;
  organization_id: string;
  nhan_su_id: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  so_ngay_nghi: number;
  trang_thai: NS03Status;
  row_version: number;
}

export class NS03Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NS03Error';
  }
}

export const ns03Domain = {
  duyetNghiPhep(donNghi: DonNghi, soDu: SoDuPhep): { donNghi: DonNghi, soDu: SoDuPhep } {
    if (donNghi.trang_thai !== 'SUBMITTED') {
      throw new NS03Error(`Chỉ được duyệt khi trạng thái là SUBMITTED. Hiện tại: ${donNghi.trang_thai}`);
    }

    if (soDu.phep_con_lai < donNghi.so_ngay_nghi) {
      throw new NS03Error('Không đủ số dư phép');
    }

    const phep_da_duyet = soDu.phep_da_duyet + donNghi.so_ngay_nghi;
    const phep_con_lai = soDu.phep_dau_ky + soDu.phep_phat_sinh - phep_da_duyet;

    return {
      donNghi: {
        ...donNghi,
        trang_thai: 'APPROVED',
        row_version: donNghi.row_version + 1
      },
      soDu: {
        ...soDu,
        phep_da_duyet,
        phep_con_lai,
        row_version: soDu.row_version + 1
      }
    };
  },

  huyNghiPhep(donNghi: DonNghi, soDu: SoDuPhep): { donNghi: DonNghi, soDu: SoDuPhep } {
    if (donNghi.trang_thai !== 'APPROVED') {
      throw new NS03Error(`Chỉ được hủy khi trạng thái là APPROVED. Hiện tại: ${donNghi.trang_thai}`);
    }

    const phep_da_duyet = Math.max(0, soDu.phep_da_duyet - donNghi.so_ngay_nghi);
    const phep_con_lai = soDu.phep_dau_ky + soDu.phep_phat_sinh - phep_da_duyet;

    return {
      donNghi: {
        ...donNghi,
        trang_thai: 'CANCELED',
        row_version: donNghi.row_version + 1
      },
      soDu: {
        ...soDu,
        phep_da_duyet,
        phep_con_lai,
        row_version: soDu.row_version + 1
      }
    };
  },

  changeStatus(donNghi: DonNghi, newStatus: NS03Status): DonNghi {
    const allowed: Record<NS03Status, NS03Status[]> = {
      'DRAFT': ['SUBMITTED'],
      'SUBMITTED': ['REJECTED'],
      'APPROVED': [],
      'REJECTED': ['DRAFT'],
      'CANCELED': []
    };

    if (!allowed[donNghi.trang_thai].includes(newStatus)) {
      throw new NS03Error(`Không thể chuyển trạng thái từ ${donNghi.trang_thai} sang ${newStatus}`);
    }

    return {
      ...donNghi,
      trang_thai: newStatus,
      row_version: donNghi.row_version + 1
    };
  }
};
