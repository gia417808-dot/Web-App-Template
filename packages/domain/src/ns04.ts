export type NS04Status = 'DRAFT' | 'REVIEWED' | 'LOCKED';

export interface KhoanDieuChinh {
  id?: string;
  loai_dieu_chinh: 'PHU_CAP' | 'KHAU_TRU';
  so_tien: number;
}

export interface BangLuong {
  id: string;
  organization_id: string;
  ky_luong: string;
  nhan_su_id: string;
  luong_thoa_thuan: number;
  tong_phu_cap: number;
  tong_khau_tru: number;
  thuc_nhan: number;
  trang_thai: NS04Status;
  row_version: number;
}

export class NS04Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NS04Error';
  }
}

export const ns04Domain = {
  tinhThucNhan(luongThoaThuan: number, dieuChinhs: KhoanDieuChinh[]): {
    tongPhuCap: number, tongKhauTru: number, thucNhan: number
  } {
    let tongPhuCap = 0;
    let tongKhauTru = 0;

    for (const dc of dieuChinhs) {
      if (dc.loai_dieu_chinh === 'PHU_CAP') {
        tongPhuCap += dc.so_tien;
      } else {
        tongKhauTru += dc.so_tien;
      }
    }

    const thucNhan = luongThoaThuan + tongPhuCap - tongKhauTru;
    
    return {
      tongPhuCap,
      tongKhauTru,
      thucNhan: Math.max(0, thucNhan) // Không cho thực nhận âm (tùy nghiệp vụ, nhưng hợp lý)
    };
  },

  chotBangLuong(bangLuong: BangLuong): BangLuong {
    if (bangLuong.trang_thai !== 'REVIEWED') {
      throw new NS04Error(`Chỉ được chốt bảng lương ở trạng thái REVIEWED. Hiện tại: ${bangLuong.trang_thai}`);
    }

    return {
      ...bangLuong,
      trang_thai: 'LOCKED',
      row_version: bangLuong.row_version + 1
    };
  },

  changeStatus(bangLuong: BangLuong, newStatus: NS04Status): BangLuong {
    const allowed: Record<NS04Status, NS04Status[]> = {
      'DRAFT': ['REVIEWED'],
      'REVIEWED': ['DRAFT', 'LOCKED'],
      'LOCKED': []
    };

    if (!allowed[bangLuong.trang_thai].includes(newStatus)) {
      throw new NS04Error(`Không thể chuyển trạng thái từ ${bangLuong.trang_thai} sang ${newStatus}`);
    }

    return {
      ...bangLuong,
      trang_thai: newStatus,
      row_version: bangLuong.row_version + 1
    };
  }
};
