import ExcelJS from 'exceljs';

export async function generateKv01Workbook(sanPhams: any[], orgId: string, version: number) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Danh mục hàng hóa');
  sheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'SKU', key: 'sku' },
    { header: 'Tên hàng', key: 'name' },
    { header: 'Đơn vị', key: 'unit' },
    { header: 'Nhóm', key: 'kind' },
    { header: 'Min Qty', key: 'min_qty' },
    { header: 'Max Qty', key: 'max_qty' }
  ];
  sanPhams.forEach(sp => {
    sheet.addRow([sp.id, sp.sku, sp.name, sp.unit, sp.kind, sp.min_qty, sp.max_qty]);
  });
  return workbook;
}