export type MK05Status = 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'CANCELED';

export interface ThuNghiem {
  id: string;
  organization_id: string;
  noi_dung_id: string;
  ten_thu_nghiem: string;
  trang_thai: MK05Status;
  ngay_bat_dau: string | null;
  ngay_ket_thuc: string | null;
  revision: number;
  row_version: number;
}

export interface BienThe {
  id: string;
  organization_id: string;
  thu_nghiem_id: string;
  ten_bien_the: string;
  luot_tiep_can: number;
  phan_hoi: number;
  ty_le_phan_hoi: number | null;
  revision: number;
  row_version: number;
}

export class MK05Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MK05Error';
  }
}

export const mk05Domain = {
  tinhTyLePhanHoi(phanHoi: number, luotTiepCan: number): number | null {
    if (luotTiepCan <= 0) return null;
    return phanHoi / luotTiepCan;
  },

  changeStatus(thuNghiem: ThuNghiem, newStatus: MK05Status): ThuNghiem {
    if (thuNghiem.trang_thai === 'COMPLETED' || thuNghiem.trang_thai === 'CANCELED') {
      throw new MK05Error('Không thể thay đổi trạng thái của thử nghiệm đã khóa');
    }

    const allowed: Record<MK05Status, MK05Status[]> = {
      'DRAFT': ['RUNNING', 'CANCELED'],
      'RUNNING': ['COMPLETED', 'CANCELED'],
      'COMPLETED': [],
      'CANCELED': []
    };

    if (!allowed[thuNghiem.trang_thai].includes(newStatus)) {
      throw new MK05Error(`Không thể chuyển trạng thái từ ${thuNghiem.trang_thai} sang ${newStatus}`);
    }

    return {
      ...thuNghiem,
      trang_thai: newStatus,
      revision: thuNghiem.revision + 1,
      row_version: thuNghiem.row_version + 1
    };
  },

  chotThuNghiem(thuNghiem: ThuNghiem, bienTheList: BienThe[]): { thuNghiem: ThuNghiem, bienTheList: BienThe[] } {
    if (thuNghiem.trang_thai !== 'RUNNING') {
      throw new MK05Error('Chỉ có thể chốt thử nghiệm đang ở trạng thái RUNNING');
    }

    const updatedThuNghiem = this.changeStatus(thuNghiem, 'COMPLETED');
    
    const updatedBienTheList = bienTheList.map(bt => ({
      ...bt,
      ty_le_phan_hoi: this.tinhTyLePhanHoi(bt.phan_hoi, bt.luot_tiep_can),
      revision: bt.revision + 1,
      row_version: bt.row_version + 1
    }));

    return { thuNghiem: updatedThuNghiem, bienTheList: updatedBienTheList };
  }
};
