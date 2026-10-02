export type KV04Status = 'DRAFT' | 'COUNTING' | 'REVIEWED' | 'POSTED';

export interface DongKiemKe {
  id: string;
  san_pham_id: string;
  ton_so: number;
  dem_thuc_te: number;
  lech: number;
}

export interface DotKiemKe {
  id: string;
  organization_id: string;
  kho_id: string;
  ma_kiem_ke: string;
  trang_thai: KV04Status;
  lines: DongKiemKe[];
  row_version: number;
}

export class KV04Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KV04Error';
  }
}

export const kv04Domain = {
  tinhLech(demThucTe: number, tonSo: number): number {
    return demThucTe - tonSo;
  },

  changeStatus(dot: DotKiemKe, newStatus: KV04Status): DotKiemKe {
    if (dot.trang_thai === 'POSTED') {
      throw new KV04Error('Đợt kiểm kê đã chốt (POSTED), không thể sửa');
    }
    
    const allowed: Record<KV04Status, KV04Status[]> = {
      'DRAFT': ['COUNTING'],
      'COUNTING': ['REVIEWED'],
      'REVIEWED': ['COUNTING', 'POSTED'],
      'POSTED': []
    };
    
    if (!allowed[dot.trang_thai].includes(newStatus)) {
      throw new KV04Error(`Không thể chuyển trạng thái từ ${dot.trang_thai} sang ${newStatus}`);
    }
    
    return {
      ...dot,
      trang_thai: newStatus,
      row_version: dot.row_version + 1
    };
  },

  capNhatDong(dot: DotKiemKe, lineId: string, demThucTe: number): DotKiemKe {
    if (dot.trang_thai !== 'COUNTING') {
      throw new KV04Error('Chỉ có thể nhập số đếm ở trạng thái COUNTING');
    }
    
    const lines = dot.lines.map(l => {
      if (l.id === lineId) {
        return {
          ...l,
          dem_thuc_te: demThucTe,
          lech: this.tinhLech(demThucTe, l.ton_so)
        };
      }
      return l;
    });
    
    return {
      ...dot,
      lines,
      row_version: dot.row_version + 1
    };
  },

  chotKiemKe(dot: DotKiemKe): DotKiemKe {
    if (dot.trang_thai !== 'REVIEWED') {
      throw new KV04Error('Chỉ có thể chốt (POSTED) khi đã REVIEWED');
    }
    
    // Recalculate diff just in case
    const lines = dot.lines.map(l => ({
      ...l,
      lech: this.tinhLech(l.dem_thuc_te, l.ton_so)
    }));
    
    return {
      ...this.changeStatus(dot, 'POSTED'),
      lines
    };
  }
};
