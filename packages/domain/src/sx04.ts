export type SX04Status = 'DRAFT' | 'INSPECTED' | 'APPROVED';

export interface PhieuKiem {
  id: string;
  organization_id: string;
  lenh_san_xuat_id: string;
  so_luong_kiem: number;
  so_luong_loi: number;
  ty_le_loi: number | null;
  trang_thai: SX04Status;
  row_version: number;
}

export class SX04Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SX04Error';
  }
}

export const sx04Domain = {
  ghiNhanLoi(phieu: PhieuKiem, soLuongKiem: number, soLuongLoi: number): PhieuKiem {
    if (phieu.trang_thai === 'APPROVED') {
      throw new SX04Error('Không thể ghi nhận khi phiếu đã được APPROVED');
    }

    if (soLuongKiem <= 0) {
      throw new SX04Error('Số lượng kiểm phải lớn hơn 0');
    }

    if (soLuongLoi < 0) {
      throw new SX04Error('Số lượng lỗi không được âm');
    }

    if (soLuongLoi > soLuongKiem) {
      throw new SX04Error('Số lượng lỗi không được lớn hơn số lượng kiểm (chống đếm lặp mẫu)');
    }

    const ty_le_loi = Number((soLuongLoi / soLuongKiem).toFixed(4));

    return {
      ...phieu,
      so_luong_kiem: soLuongKiem,
      so_luong_loi: soLuongLoi,
      ty_le_loi,
      trang_thai: 'INSPECTED',
      row_version: phieu.row_version + 1
    };
  },

  changeStatus(phieu: PhieuKiem, newStatus: SX04Status): PhieuKiem {
    const allowed: Record<SX04Status, SX04Status[]> = {
      'DRAFT': ['INSPECTED'],
      'INSPECTED': ['APPROVED'],
      'APPROVED': []
    };

    if (!allowed[phieu.trang_thai].includes(newStatus)) {
      throw new SX04Error(`Không thể chuyển trạng thái từ ${phieu.trang_thai} sang ${newStatus}`);
    }

    return {
      ...phieu,
      trang_thai: newStatus,
      row_version: phieu.row_version + 1
    };
  }
};
