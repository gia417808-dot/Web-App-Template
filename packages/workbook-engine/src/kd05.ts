import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

export async function generateKd05Workbook(customersData: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('DanhSachChamSoc');
    sheet.columns = [
        { header: 'Mã KH', key: 'code', width: 15 },
        { header: 'Tên KH', key: 'name', width: 30 },
        { header: 'Ngày Tương Tác Cuối', key: 'last_interaction_date', width: 25 },
        { header: 'Số Ngày Chưa Tương Tác', key: 'days_since', width: 30 }
    ];

    let rowNum = 2;
    for (const customer of customersData) {
        let lastDate = '';
        if (customer.last_interaction) {
            lastDate = new Date(customer.last_interaction.interaction_date).toLocaleDateString('vi-VN');
        }
        sheet.addRow({
            code: customer.code,
            name: customer.name,
            last_interaction_date: lastDate,
            days_since: { formula: `IF(ISBLANK(C${rowNum}), "NO_CONTACT", TODAY() - C${rowNum})`, result: customer.days_since_last_interaction }
        });
        rowNum++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}