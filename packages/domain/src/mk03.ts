// MK03: Lead theo nguồn
export type LeadStatus = 'new' | 'qualified' | 'converted' | 'invalid';

export interface NguonLead {
    id: string;
    ten_nguon: string;
    mo_ta?: string;
    tenant_id: string;
}

export interface Lead {
    id: string;
    nguon_id?: string;
    ten_lead: string;
    so_dien_thoai?: string;
    trang_thai: LeadStatus;
    ngay_tao: Date;
    ngay_chuyen_doi?: Date;
    duplicate_of?: string;
    version: number;
    tenant_id: string;
}

export class LeadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LeadError';
    }
}

export const mk03Domain = {
    ganNguonLead(lead: Lead, nguon_id: string): Lead {
        if (lead.trang_thai === 'invalid') {
            throw new LeadError("Không thể gán nguồn cho Lead đang ở trạng thái invalid");
        }
        return {
            ...lead,
            nguon_id,
            version: lead.version + 1
        };
    },

    changeStatus(lead: Lead, newStatus: LeadStatus): Lead {
        const allowedTransitions: Record<LeadStatus, LeadStatus[]> = {
            'new': ['qualified', 'invalid'],
            'qualified': ['converted', 'invalid'],
            'converted': [],
            'invalid': []
        };

        if (!allowedTransitions[lead.trang_thai].includes(newStatus)) {
            throw new LeadError(`Không thể chuyển trạng thái từ ${lead.trang_thai} sang ${newStatus}`);
        }

        const updatedLead = {
            ...lead,
            trang_thai: newStatus,
            version: lead.version + 1
        };

        if (newStatus === 'converted') {
            updatedLead.ngay_chuyen_doi = new Date();
        }

        return updatedLead;
    },

    mergeDuplicate(lead: Lead, duplicateOfId: string): Lead {
        if (lead.id === duplicateOfId) {
            throw new LeadError("Lead không thể tự duplicate chính nó");
        }
        if (lead.trang_thai === 'converted') {
             throw new LeadError("Không thể đánh dấu trùng lặp cho Lead đã chuyển đổi");
        }
        return {
            ...lead,
            trang_thai: 'invalid',
            duplicate_of: duplicateOfId,
            version: lead.version + 1
        };
    },

    calculateConversionRate(leads: Lead[]): { converted: number; validLeads: number; rate: number } {
        let converted = 0;
        let validLeads = 0;

        for (const lead of leads) {
            if (lead.trang_thai !== 'invalid') {
                validLeads++;
                if (lead.trang_thai === 'converted') {
                    converted++;
                }
            }
        }

        if (converted > validLeads) {
             throw new LeadError("Lỗi hệ thống: converted lớn hơn valid_leads");
        }

        const rate = validLeads > 0 ? converted / validLeads : 0;
        return { converted, validLeads, rate };
    }
};
