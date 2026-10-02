export type NS05Status = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFERED' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';

export interface UngVien {
  id: string;
  organization_id: string;
  ho_ten: string;
  vi_tri_ung_tuyen: string;
  ngay_mo_vi_tri: string; // YYYY-MM-DD
  ngay_nhan_viec: string | null; // YYYY-MM-DD
  thoi_gian_tuyen: number | null;
  trang_thai: NS05Status;
  row_version: number;
}

export class NS05Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NS05Error';
  }
}

export const ns05Domain = {
  tinhThoiGianTuyen(ngayMo: string, ngayNhan: string | null): number | null {
    if (!ngayNhan) return null;
    const mo = new Date(ngayMo);
    const nhan = new Date(ngayNhan);
    if (nhan < mo) {
      throw new NS05Error('Ngày nhận việc không thể trước ngày mở vị trí');
    }
    const diffTime = Math.abs(nhan.getTime() - mo.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  chuyenVongTuyen(ungVien: UngVien, nextStatus: NS05Status, ngayNhanViec?: string): UngVien {
    const allowed: Record<NS05Status, NS05Status[]> = {
      'APPLIED': ['SCREENING', 'REJECTED', 'WITHDRAWN'],
      'SCREENING': ['INTERVIEW', 'REJECTED', 'WITHDRAWN'],
      'INTERVIEW': ['OFFERED', 'REJECTED', 'WITHDRAWN'],
      'OFFERED': ['HIRED', 'REJECTED', 'WITHDRAWN'],
      'HIRED': [], // Không đổi nữa
      'REJECTED': [],
      'WITHDRAWN': []
    };

    if (!allowed[ungVien.trang_thai].includes(nextStatus)) {
      throw new NS05Error(`Không thể chuyển ứng viên từ ${ungVien.trang_thai} sang ${nextStatus}`);
    }

    let nhanViec = ungVien.ngay_nhan_viec;
    let thoiGian = ungVien.thoi_gian_tuyen;

    if (nextStatus === 'HIRED') {
      if (!ngayNhanViec) {
        throw new NS05Error('Khi chuyển sang HIRED phải cung cấp ngày nhận việc');
      }
      nhanViec = ngayNhanViec;
      thoiGian = this.tinhThoiGianTuyen(ungVien.ngay_mo_vi_tri, nhanViec);
    } else {
      nhanViec = null;
      thoiGian = null;
    }

    return {
      ...ungVien,
      trang_thai: nextStatus,
      ngay_nhan_viec: nhanViec,
      thoi_gian_tuyen: thoiGian,
      row_version: ungVien.row_version + 1
    };
  }
};
