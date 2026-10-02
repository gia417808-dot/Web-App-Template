export type KT03Status = 'OPEN' | 'PARTIALLY_PAID' | 'SETTLED' | 'OVERPAID';

export interface PhaiTra {
  id: string;
  organization_id: string;
  nha_cung_cap_id: string;
  ma_phai_tra: string;
  so_goc: number;
  da_thanh_toan: number;
  con_lai: number;
  trang_thai: KT03Status;
  han_thanh_toan: string;
  row_version: number;
}

export interface ThanhToanPhaiTra {
  id: string;
  organization_id: string;
  phai_tra_id: string;
  so_tien: number;
  ngay_thanh_toan: string;
  trang_thai: 'DRAFT' | 'CONFIRMED';
  row_version: number;
}

export class KT03Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KT03Error';
  }
}

export const kt03Domain = {
  xacDinhTrangThai(daThanhToan: number, soGoc: number): KT03Status {
    const conLai = soGoc - daThanhToan;
    if (conLai < 0) return 'OVERPAID';
    if (conLai === 0) return 'SETTLED';
    if (daThanhToan > 0) return 'PARTIALLY_PAID';
    return 'OPEN';
  },

  doiSoatChi(phaiTra: PhaiTra, thanhToan: ThanhToanPhaiTra): { phaiTra: PhaiTra, thanhToan: ThanhToanPhaiTra } {
    if (thanhToan.trang_thai === 'CONFIRMED') {
      throw new KT03Error('Thanh toán này đã được đối soát');
    }
    
    if (thanhToan.phai_tra_id !== phaiTra.id) {
      throw new KT03Error('Thanh toán không thuộc khoản phải trả này');
    }

    const daThanhToanMoi = phaiTra.da_thanh_toan + thanhToan.so_tien;
    const conLaiMoi = phaiTra.so_goc - daThanhToanMoi;
    const trangThaiMoi = this.xacDinhTrangThai(daThanhToanMoi, phaiTra.so_goc);

    const ptUpdate = {
      ...phaiTra,
      da_thanh_toan: daThanhToanMoi,
      con_lai: conLaiMoi,
      trang_thai: trangThaiMoi,
      row_version: phaiTra.row_version + 1
    };

    const ttUpdate = {
      ...thanhToan,
      trang_thai: 'CONFIRMED' as const,
      row_version: thanhToan.row_version + 1
    };

    return { phaiTra: ptUpdate, thanhToan: ttUpdate };
  }
};
