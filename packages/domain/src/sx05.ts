export type SX05Status = 'DRAFT' | 'CALCULATED' | 'LOCKED';

export interface LenhSanXuatSX05 {
  id: string;
  organization_id: string;
  ma_lenh: string;
  luong_dat: number;
  tong_chi_phi: number;
  gia_thanh_don_vi: number | null;
  trang_thai_gia_thanh: SX05Status;
  row_version: number;
}

export interface ChiPhiSX {
  id: string;
  lenh_san_xuat_id: string;
  loai_chi_phi: string;
  so_tien: number;
  trang_thai: 'PENDING' | 'APPROVED';
}

export class SX05Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SX05Error';
  }
}

export const sx05Domain = {
  tinhGiaThanh(lenh: LenhSanXuatSX05, chiPhis: ChiPhiSX[]): LenhSanXuatSX05 {
    if (lenh.trang_thai_gia_thanh === 'LOCKED') {
      throw new SX05Error('Giá thành đã khóa, không thể tính lại');
    }

    let tongChiPhi = 0;
    for (const cp of chiPhis) {
      if (cp.trang_thai === 'APPROVED') {
        tongChiPhi += Number(cp.so_tien);
      }
    }

    const luongDat = Number(lenh.luong_dat);
    const giaThanhDonVi = luongDat > 0 ? Number((tongChiPhi / luongDat).toFixed(4)) : null;

    return {
      ...lenh,
      tong_chi_phi: tongChiPhi,
      gia_thanh_don_vi: giaThanhDonVi,
      trang_thai_gia_thanh: 'CALCULATED',
      row_version: lenh.row_version + 1
    };
  },

  lockGiaThanh(lenh: LenhSanXuatSX05): LenhSanXuatSX05 {
    if (lenh.trang_thai_gia_thanh !== 'CALCULATED') {
      throw new SX05Error(`Chỉ khóa giá thành từ trạng thái CALCULATED. Hiện tại: ${lenh.trang_thai_gia_thanh}`);
    }

    if (lenh.tong_chi_phi <= 0) {
      throw new SX05Error('Thiếu chi phí hợp lệ, không thể khóa giá thành');
    }

    return {
      ...lenh,
      trang_thai_gia_thanh: 'LOCKED',
      row_version: lenh.row_version + 1
    };
  }
};
