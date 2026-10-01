import { Router } from 'express';
import { getTenantId } from '@web-app-template/auth-audit';
import { mk03Domain, LeadStatus } from '@web-app-template/domain';
import { generateMk03Workbook } from '@web-app-template/workbook-engine';

export const mk03Router = Router();

mk03Router.get('/leads', async (req: any, res) => {
    const tenantId = getTenantId(req);
    try {
        const { rows } = await req.db.query('SELECT * FROM "Lead" WHERE organization_id = $1 ORDER BY ngay_tao DESC', [tenantId]);
        res.json(rows);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

mk03Router.get('/kpi', async (req: any, res) => {
    const tenantId = getTenantId(req);
    try {
        const { rows } = await req.db.query('SELECT * FROM "Lead" WHERE organization_id = $1', [tenantId]);
        const result = mk03Domain.calculateConversionRate(rows);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

mk03Router.post('/leads/:id/gan-nguon', async (req: any, res) => {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { nguon_id } = req.body;

    if (!nguon_id) {
        return res.status(400).json({ error: 'Missing nguon_id' });
    }

    try {
        const { rows: leadRows } = await req.db.query('SELECT * FROM "Lead" WHERE id = $1 AND organization_id = $2', [id, tenantId]);
        if (leadRows.length === 0) return res.status(404).json({ error: 'Lead not found' });
        
        const lead = leadRows[0];
        const updatedLead = mk03Domain.ganNguonLead(lead, nguon_id);

        const { rows } = await req.db.query(
            `UPDATE "Lead" SET nguon_id = $1, version = $2 WHERE id = $3 AND version = $4 RETURNING *`,
            [updatedLead.nguon_id, updatedLead.version, id, lead.version]
        );
        
        if (rows.length === 0) return res.status(409).json({ error: 'Concurrency conflict' });
        res.json(rows[0]);
    } catch (e: any) {
        if (e.name === 'LeadError') {
            return res.status(400).json({ error: e.message });
        }
        res.status(500).json({ error: e.message });
    }
});

mk03Router.put('/leads/:id/status', async (req: any, res) => {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Missing status' });

    try {
        const { rows: leadRows } = await req.db.query('SELECT * FROM "Lead" WHERE id = $1 AND organization_id = $2', [id, tenantId]);
        if (leadRows.length === 0) return res.status(404).json({ error: 'Lead not found' });
        
        const lead = leadRows[0];
        const updatedLead = mk03Domain.changeStatus(lead, status as LeadStatus);

        const { rows } = await req.db.query(
            `UPDATE "Lead" SET trang_thai = $1, ngay_chuyen_doi = $2, version = $3 WHERE id = $4 AND version = $5 RETURNING *`,
            [updatedLead.trang_thai, updatedLead.ngay_chuyen_doi, updatedLead.version, id, lead.version]
        );
        
        if (rows.length === 0) return res.status(409).json({ error: 'Concurrency conflict' });
        res.json(rows[0]);
    } catch (e: any) {
        if (e.name === 'LeadError') {
            return res.status(400).json({ error: e.message });
        }
        res.status(500).json({ error: e.message });
    }
});

mk03Router.get('/export', async (req: any, res) => {
    const tenantId = getTenantId(req);
    try {
        const { rows: leads } = await req.db.query('SELECT * FROM "Lead" WHERE organization_id = $1', [tenantId]);
        const { rows: sources } = await req.db.query('SELECT * FROM "NguonLead" WHERE organization_id = $1', [tenantId]);
        
        const buffer = await generateMk03Workbook(leads, sources);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="mk03-leads.xlsx"');
        res.send(buffer);
    } catch (e: any) {
        res.status(500).json({ error: 'Export error' });
    }
});
