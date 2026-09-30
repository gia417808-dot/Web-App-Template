import ExcelJS from 'exceljs';

export async function generateKd01Workbook(donHangs: any[], tenantId: string, version: number) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Báo giá và Đơn hàng');
  sheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'Mã', key: 'code' },
    { header: 'Khách hàng ID', key: 'customer_id' },
    { header: 'Ngày', key: 'business_date' },
    { header: 'Trạng thái', key: 'status' },
    { header: 'Tổng tiền', key: 'total_vnd' }
  ];
  donHangs.forEach(dh => {
    sheet.addRow([dh.id, dh.code, dh.customer_id, dh.business_date, dh.status, dh.total_vnd]);
  });
  return workbook;
}
