export type SX03Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface CongDoan {
  id: string;
  organization_id: string;
  lenh_san_xuat_id: string;
  ten_cong_doan: string;
  trong_so: number;
  ty_le_dat: number;
  trang_thai: SX03Status;
  row_version: number;
}

export interface NhatKySX {
  id?: string;
  organization_id: string;
  cong_doan_id: string;
  ty_le_dat_truoc: number;
  ty_le_dat_sau: number;
  trang_thai_truoc: SX03Status;
  trang_thai_sau: SX03Status;
  ghi_chu?: string;
}

export class SX03Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SX03Error';
  }
}

export const sx03Domain = {
  capNhatTienDo(cd: CongDoan, tyLeMoi: number, trangThaiMoi?: SX03Status, ghiChu?: string): { updatedCd: CongDoan, nhatKy: NhatKySX } {
    if (cd.trang_thai === 'COMPLETED') {
      throw new SX03Error('Không thể cập nhật tiến độ cho công đoạn đã hoàn thành');
    }
    
    if (tyLeMoi < 0 || tyLeMoi > 1) {
      throw new SX03Error('Tỷ lệ đạt phải nằm trong khoảng từ 0 đến 1');
    }

    const tThai = trangThaiMoi || cd.trang_thai;
    const allowedTransitions: Record<SX03Status, SX03Status[]> = {
      'PENDING': ['IN_PROGRESS', 'BLOCKED', 'PENDING'],
      'IN_PROGRESS': ['COMPLETED', 'BLOCKED', 'IN_PROGRESS'],
      'COMPLETED': [],
      'BLOCKED': ['IN_PROGRESS', 'BLOCKED']
    };

    if (!allowedTransitions[cd.trang_thai].includes(tThai)) {
      throw new SX03Error(`Không thể chuyển trạng thái công đoạn từ ${cd.trang_thai} sang ${tThai}`);
    }

    const updatedCd: CongDoan = {
      ...cd,
      ty_le_dat: Number(tyLeMoi.toFixed(4)),
      trang_thai: tThai,
      row_version: cd.row_version + 1
    };

    const nhatKy: NhatKySX = {
      organization_id: cd.organization_id,
      cong_doan_id: cd.id,
      ty_le_dat_truoc: cd.ty_le_dat,
      ty_le_dat_sau: updatedCd.ty_le_dat,
      trang_thai_truoc: cd.trang_thai,
      trang_thai_sau: updatedCd.trang_thai,
      ghi_chu: ghiChu
    };

    return { updatedCd, nhatKy };
  },

  tinhTienDoTong(dsCongDoan: CongDoan[]): number | null {
    let sumWeight = 0;
    let sumWeightedProgress = 0;

    for (const cd of dsCongDoan) {
      if (cd.trong_so >= 0) {
        sumWeight += cd.trong_so;
        sumWeightedProgress += (cd.ty_le_dat * cd.trong_so);
      }
    }

    if (sumWeight === 0) return null;
    return Number((sumWeightedProgress / sumWeight).toFixed(4));
  }
};
