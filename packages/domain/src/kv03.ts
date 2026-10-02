export type KV03Status = 'DRAFT' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CLOSED';

export interface DonMua {
  id: string;
  organization_id: string;
  yeu_cau_id: string | null;
  san_pham_id: string;
  ma_don: string;
  trang_thai: KV03Status;
  luong_dat: number;
  luong_nhan_hop_le: number;
  chenh_lech_nhan: number;
  row_version: number;
}

export class KV03Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KV03Error';
  }
}

export const kv03Domain = {
  tinhChenhLech(luongDat: number, luongNhan: number): number {
    return luongDat - luongNhan;
  },

  changeStatus(donMua: DonMua, newStatus: KV03Status): DonMua {
    if (donMua.trang_thai === 'CLOSED') {
      throw new KV03Error('Đơn mua đã đóng, không thể đổi trạng thái');
    }

    const allowed: Record<KV03Status, KV03Status[]> = {
      'DRAFT': ['APPROVED'],
      'APPROVED': ['ORDERED', 'CLOSED'],
      'ORDERED': ['PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED'],
      'PARTIALLY_RECEIVED': ['RECEIVED', 'CLOSED'],
      'RECEIVED': ['CLOSED'],
      'CLOSED': []
    };

    if (!allowed[donMua.trang_thai].includes(newStatus)) {
      throw new KV03Error(`Không thể chuyển trạng thái từ ${donMua.trang_thai} sang ${newStatus}`);
    }

    return {
      ...donMua,
      trang_thai: newStatus,
      row_version: donMua.row_version + 1
    };
  },

  datMuaHang(donMua: DonMua): DonMua {
    if (donMua.trang_thai !== 'APPROVED') {
      throw new KV03Error('Chỉ có thể đặt mua đơn hàng ở trạng thái APPROVED');
    }

    if (donMua.luong_dat <= 0) {
      throw new KV03Error('Lượng đặt phải lớn hơn 0');
    }

    return {
      ...this.changeStatus(donMua, 'ORDERED'),
      chenh_lech_nhan: this.tinhChenhLech(donMua.luong_dat, donMua.luong_nhan_hop_le)
    };
  },

  nhanHang(donMua: DonMua, luongNhanThem: number): DonMua {
    if (!['ORDERED', 'PARTIALLY_RECEIVED'].includes(donMua.trang_thai)) {
      throw new KV03Error('Chỉ có thể nhận hàng khi đơn đã đặt (ORDERED hoặc PARTIALLY_RECEIVED)');
    }

    if (luongNhanThem <= 0) {
      throw new KV03Error('Lượng nhận thêm phải lớn hơn 0');
    }

    const newLuongNhan = donMua.luong_nhan_hop_le + luongNhanThem;
    const chenhLech = this.tinhChenhLech(donMua.luong_dat, newLuongNhan);
    
    let nextStatus: KV03Status = donMua.trang_thai;
    if (chenhLech <= 0) {
      nextStatus = 'RECEIVED';
    } else {
      nextStatus = 'PARTIALLY_RECEIVED';
    }

    return {
      ...donMua,
      trang_thai: nextStatus,
      luong_nhan_hop_le: newLuongNhan,
      chenh_lech_nhan: chenhLech,
      row_version: donMua.row_version + 1
    };
  }
};
