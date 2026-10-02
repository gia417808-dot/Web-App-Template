export type KT05Status = 'CALCULATED' | 'REVIEWED' | 'MISSING_COST';

export interface LaiGopChiTiet {
  chi_tiet_don_id: string;
  doanh_thu: number;
  gia_von: number | null;
  lai_gop: number | null;
}

export interface LaiGopDonHang {
  id: string;
  organization_id: string;
  don_hang_id: string;
  doanh_thu_thuan: number;
  tong_gia_von: number | null;
  lai_gop: number | null;
  trang_thai: KT05Status;
  row_version: number;
  chi_tiet: LaiGopChiTiet[];
}

export class KT05Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KT05Error';
  }
}

export const kt05Domain = {
  tinhLaiGop(
    organizationId: string,
    donHangId: string,
    chiTietLines: { chi_tiet_don_id: string, doanh_thu: number, gia_von: number | null }[]
  ): Omit<LaiGopDonHang, 'id' | 'row_version'> {
    
    let tongDoanhThu = 0;
    let tongGiaVon = 0;
    let missingCost = false;

    const chiTietLaiGop: LaiGopChiTiet[] = chiTietLines.map(line => {
      tongDoanhThu += line.doanh_thu;
      
      let laiGopLine = null;
      if (line.gia_von === null || line.gia_von === undefined) {
        missingCost = true;
      } else {
        tongGiaVon += line.gia_von;
        laiGopLine = line.doanh_thu - line.gia_von;
      }

      return {
        chi_tiet_don_id: line.chi_tiet_don_id,
        doanh_thu: line.doanh_thu,
        gia_von: line.gia_von,
        lai_gop: laiGopLine
      };
    });

    const trangThai: KT05Status = missingCost ? 'MISSING_COST' : 'CALCULATED';

    return {
      organization_id: organizationId,
      don_hang_id: donHangId,
      doanh_thu_thuan: tongDoanhThu,
      tong_gia_von: missingCost ? null : tongGiaVon,
      lai_gop: missingCost ? null : (tongDoanhThu - tongGiaVon),
      trang_thai: trangThai,
      chi_tiet: chiTietLaiGop
    };
  },

  changeStatus(laiGopDon: LaiGopDonHang, newStatus: KT05Status): LaiGopDonHang {
    const allowed: Record<KT05Status, KT05Status[]> = {
      'MISSING_COST': ['CALCULATED'], // Requires re-calculation
      'CALCULATED': ['REVIEWED'],
      'REVIEWED': []
    };

    if (!allowed[laiGopDon.trang_thai].includes(newStatus)) {
      throw new KT05Error(`Không thể chuyển trạng thái từ ${laiGopDon.trang_thai} sang ${newStatus}`);
    }

    if (newStatus === 'REVIEWED' && laiGopDon.tong_gia_von === null) {
        throw new KT05Error('Không thể đánh giá (REVIEWED) khi chưa đủ giá vốn (MISSING_COST)');
    }

    return {
      ...laiGopDon,
      trang_thai: newStatus,
      row_version: laiGopDon.row_version + 1
    };
  }
};
