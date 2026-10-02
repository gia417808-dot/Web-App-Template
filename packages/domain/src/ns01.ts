export type NS01Status = 'ACTIVE' | 'INACTIVE';

export interface NhanSu {
  id: string;
  organization_id: string;
  ma_nhan_vien: string;
  ho_ten: string;
  ngay_vao_lam: string; // YYYY-MM-DD
  tham_nien_ngay: number;
  trang_thai: NS01Status;
  row_version: number;
}

export class NS01Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NS01Error';
  }
}

export const ns01Domain = {
  capNhatHoSo(
    nhanSu: NhanSu,
    hoTenMoi: string,
    ngayVaoLamMoi: string,
    currentDate: Date = new Date()
  ): NhanSu {
    const vaoLamDate = new Date(ngayVaoLamMoi);
    if (vaoLamDate > currentDate) {
      throw new NS01Error('Ngày vào làm không được ở trong tương lai');
    }

    // Reset thời gian để tính số ngày cho chính xác (so sánh lúc 00:00:00)
    const today = new Date(currentDate.getTime());
    today.setHours(0, 0, 0, 0);
    const vaoLam = new Date(vaoLamDate.getTime());
    vaoLam.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - vaoLam.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...nhanSu,
      ho_ten: hoTenMoi,
      ngay_vao_lam: ngayVaoLamMoi,
      tham_nien_ngay: diffDays,
      row_version: nhanSu.row_version + 1
    };
  },

  changeStatus(nhanSu: NhanSu, newStatus: NS01Status): NhanSu {
    const allowed: Record<NS01Status, NS01Status[]> = {
      'ACTIVE': ['INACTIVE'],
      'INACTIVE': ['ACTIVE']
    };

    if (!allowed[nhanSu.trang_thai].includes(newStatus)) {
      throw new NS01Error(`Không thể chuyển trạng thái từ ${nhanSu.trang_thai} sang ${newStatus}`);
    }

    return {
      ...nhanSu,
      trang_thai: newStatus,
      row_version: nhanSu.row_version + 1
    };
  }
};
