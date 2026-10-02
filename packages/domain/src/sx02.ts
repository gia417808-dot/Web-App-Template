export type SX02Status = 'DRAFT' | 'APPROVED' | 'ARCHIVED';

export interface VatTu {
  id: string;
  organization_id: string;
  ma_vat_tu: string;
  ten_vat_tu: string;
  dvt: string;
}

export interface DinhMuc {
  id: string;
  organization_id: string;
  san_pham_ma: string;
  vat_tu_id: string;
  so_luong_dinh_muc: number;
  ty_le_hao_hut: number;
  trang_thai: SX02Status;
  row_version: number;
}

export interface DuTruVatTu {
  id?: string;
  organization_id: string;
  dinh_muc_id: string;
  luong_ke_hoach: number;
  luong_can: number;
}

export class SX02Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SX02Error';
  }
}

export const sx02Domain = {
  duTruVatTu(dinhMuc: DinhMuc, luongKeHoach: number): DuTruVatTu {
    if (dinhMuc.trang_thai !== 'APPROVED') {
      throw new SX02Error(`Chỉ được dự trù vật tư khi định mức ở trạng thái APPROVED. Hiện tại: ${dinhMuc.trang_thai}`);
    }
    
    if (dinhMuc.ty_le_hao_hut < 0 || dinhMuc.ty_le_hao_hut > 100) {
      throw new SX02Error('Tỷ lệ hao hụt phải từ 0 đến 100');
    }

    const haoHutFactor = 1 + (dinhMuc.ty_le_hao_hut / 100);
    const luongCan = dinhMuc.so_luong_dinh_muc * luongKeHoach * haoHutFactor;

    return {
      organization_id: dinhMuc.organization_id,
      dinh_muc_id: dinhMuc.id,
      luong_ke_hoach: luongKeHoach,
      luong_can: Number(luongCan.toFixed(4)) // Làm tròn 4 chữ số
    };
  },

  changeStatus(dinhMuc: DinhMuc, newStatus: SX02Status): DinhMuc {
    const allowed: Record<SX02Status, SX02Status[]> = {
      'DRAFT': ['APPROVED'],
      'APPROVED': ['ARCHIVED'],
      'ARCHIVED': []
    };

    if (!allowed[dinhMuc.trang_thai].includes(newStatus)) {
      throw new SX02Error(`Không thể chuyển trạng thái từ ${dinhMuc.trang_thai} sang ${newStatus}`);
    }

    return {
      ...dinhMuc,
      trang_thai: newStatus,
      row_version: dinhMuc.row_version + 1
    };
  }
};
