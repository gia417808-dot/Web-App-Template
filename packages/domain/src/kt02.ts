export type KT02Status = 'OPEN' | 'PARTIALLY_PAID' | 'SETTLED' | 'OVERPAID';

export interface PhaiThu {
  id: string;
  organization_id: string;
  khach_hang_id: string;
  ma_phai_thu: string;
  so_goc: number;
  da_thanh_toan: number;
  con_lai: number;
  trang_thai: KT02Status;
  han_thanh_toan: string;
  row_version: number;
}

export interface ThanhToanPhaiThu {
  id: string;
  organization_id: string;
  phai_thu_id: string;
  so_tien: number;
  ngay_thanh_toan: string;
  trang_thai: 'DRAFT' | 'CONFIRMED';
  row_version: number;
}

export class KT02Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KT02Error';
  }
}

export const kt02Domain = {
  xacDinhTrangThai(daThanhToan: number, soGoc: number): KT02Status {
    const conLai = soGoc - daThanhToan;
    if (conLai < 0) return 'OVERPAID';
    if (conLai === 0) return 'SETTLED';
    if (daThanhToan > 0) return 'PARTIALLY_PAID';
    return 'OPEN';
  },

  doiSoatThu(phaiThu: PhaiThu, thanhToan: ThanhToanPhaiThu): { phaiThu: PhaiThu, thanhToan: ThanhToanPhaiThu } {
    if (thanhToan.trang_thai === 'CONFIRMED') {
      throw new KT02Error('Thanh toán này đã được đối soát');
    }
    
    if (thanhToan.phai_thu_id !== phaiThu.id) {
      throw new KT02Error('Thanh toán không thuộc khoản phải thu này');
    }

    const daThanhToanMoi = phaiThu.da_thanh_toan + thanhToan.so_tien;
    const conLaiMoi = phaiThu.so_goc - daThanhToanMoi;
    const trangThaiMoi = this.xacDinhTrangThai(daThanhToanMoi, phaiThu.so_goc);

    const ptUpdate = {
      ...phaiThu,
      da_thanh_toan: daThanhToanMoi,
      con_lai: conLaiMoi,
      trang_thai: trangThaiMoi,
      row_version: phaiThu.row_version + 1
    };

    const ttUpdate = {
      ...thanhToan,
      trang_thai: 'CONFIRMED' as const,
      row_version: thanhToan.row_version + 1
    };

    return { phaiThu: ptUpdate, thanhToan: ttUpdate };
  }
};
