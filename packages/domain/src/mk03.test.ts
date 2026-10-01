import { test } from 'node:test';
import assert from 'node:assert';
import { mk03Domain, Lead, LeadError } from './mk03';

test('MK03 Domain Logic', async (t) => {
    const createBaseLead = (id: string = 'l1', status: any = 'new'): Lead => ({
        id,
        ten_lead: 'Nguyễn Văn A',
        trang_thai: status,
        ngay_tao: new Date(),
        version: 1,
        tenant_id: 'default'
    });

    await t.test('ganNguonLead thanh cong', () => {
        const lead = createBaseLead();
        const updated = mk03Domain.ganNguonLead(lead, 'src1');
        assert.strictEqual(updated.nguon_id, 'src1');
        assert.strictEqual(updated.version, 2);
    });

    await t.test('ganNguonLead that bai cho lead invalid', () => {
        const lead = createBaseLead('l1', 'invalid');
        assert.throws(() => mk03Domain.ganNguonLead(lead, 'src1'), LeadError);
    });

    await t.test('changeStatus cho phep workflow hop le', () => {
        const lead = createBaseLead();
        const updated1 = mk03Domain.changeStatus(lead, 'qualified');
        assert.strictEqual(updated1.trang_thai, 'qualified');
        
        const updated2 = mk03Domain.changeStatus(updated1, 'converted');
        assert.strictEqual(updated2.trang_thai, 'converted');
        assert.ok(updated2.ngay_chuyen_doi !== undefined);
    });

    await t.test('changeStatus chan workflow khong hop le', () => {
        const lead = createBaseLead();
        assert.throws(() => mk03Domain.changeStatus(lead, 'converted'), LeadError);
    });

    await t.test('mergeDuplicate thanh cong', () => {
        const lead = createBaseLead('l1');
        const updated = mk03Domain.mergeDuplicate(lead, 'l2');
        assert.strictEqual(updated.trang_thai, 'invalid');
        assert.strictEqual(updated.duplicate_of, 'l2');
    });

    await t.test('calculateConversionRate tinh toan dung', () => {
        const leads: Lead[] = [
            createBaseLead('1', 'converted'),
            createBaseLead('2', 'qualified'),
            createBaseLead('3', 'new'),
            createBaseLead('4', 'invalid'),
        ];
        const result = mk03Domain.calculateConversionRate(leads);
        assert.strictEqual(result.validLeads, 3);
        assert.strictEqual(result.converted, 1);
        assert.strictEqual(result.rate, 1/3);
    });
    
    await t.test('calculateConversionRate tra ve 0 khi mau so la 0', () => {
        const leads: Lead[] = [
            createBaseLead('1', 'invalid'),
        ];
        const result = mk03Domain.calculateConversionRate(leads);
        assert.strictEqual(result.validLeads, 0);
        assert.strictEqual(result.converted, 0);
        assert.strictEqual(result.rate, 0);
    });
});
