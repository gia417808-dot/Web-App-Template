import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

export async function generateMk02Workbook(campaignsData: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'System';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('ChienDichNganSach');
  sheet.columns = [
    { header: 'Mã Chiến Dịch', key: 'code', width: 18 },
    { header: 'Tên Chiến Dịch', key: 'name', width: 30 },
    { header: 'Dự Toán (VND)', key: 'budget_vnd', width: 20 },
    { header: 'Chi Phí Xác Nhận (VND)', key: 'confirmed_cost', width: 25 },
    { header: 'Ngân Sách Còn Lại (VND)', key: 'remaining_budget', width: 25 },
    { header: 'Cảnh Báo', key: 'alert', width: 20 }
  ];

  let rowNum = 2;
  for (const campaign of campaignsData) {
    const budget = Number(campaign.budget_vnd) || 0;
    const confirmed = Number(campaign.confirmed_cost) || 0;
    const remaining = budget - confirmed;

    sheet.addRow({
      code: campaign.code,
      name: campaign.name,
      budget_vnd: budget,
      confirmed_cost: confirmed,
      remaining_budget: {
        formula: `C${rowNum}-D${rowNum}`,
        result: remaining
      },
      alert: {
        formula: `IF(E${rowNum}<0,"VƯỢT NGÂN SÁCH","HỢP LỆ")`,
        result: remaining < 0 ? 'VƯỢT NGÂN SÁCH' : 'HỢP LỆ'
      }
    });
    rowNum++;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
