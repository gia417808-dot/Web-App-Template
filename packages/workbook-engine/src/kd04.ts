import ExcelJS from 'exceljs';
import { calculateContractStatus } from '@web-app-template/domain';

export async function generateKd04Workbook(contracts: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Hợp Đồng');

  sheet.columns = [
    { header: 'Mã HĐ', key: 'code', width: 15 },
    { header: 'Khách Hàng', key: 'customer_id', width: 36 },
    { header: 'Ngày Bắt Đầu', key: 'start_date', width: 15 },
    { header: 'Ngày Hết Hạn', key: 'expiry_date', width: 15 },
    { header: 'Trạng Thái', key: 'status', width: 15 },
    { header: 'Còn Lại (Ngày)', key: 'days_remaining', width: 15 },
    { header: 'Cần Nhắc', key: 'should_remind', width: 15 }
  ];

  const today = new Date();
  contracts.forEach(c => {
    const statusResult = calculateContractStatus(c.expiry_date, c.status, today);
    sheet.addRow({
      code: c.code,
      customer_id: c.customer_id,
      start_date: c.start_date,
      expiry_date: c.expiry_date,
      status: c.status,
      days_remaining: statusResult.days_remaining,
      should_remind: statusResult.should_remind ? 'CÓ' : 'KHÔNG'
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
