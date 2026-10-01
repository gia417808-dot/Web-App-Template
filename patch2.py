import sys

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

mk_tables = """
    {activeTab === 'MK02' && (
      <table>
        <thead><tr><th>Chiến Dịch</th><th>Ngân Sách</th><th>Đã Chi</th><th>Còn Lại</th><th>Quá Ngân Sách</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.ten_chien_dich}</td><td>{i.ngan_sach}</td><td>{i.da_chi}</td><td>{i.con_lai}</td><td>{i.qua_ngan_sach ? 'Có' : 'Không'}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'MK03' && (
      <div>
        {kpi !== null && <h3>Tỷ lệ chuyển đổi: {kpi.toFixed(2)}%</h3>}
        <table>
          <thead><tr><th>ID</th><th>Tên Lead</th><th>Trạng Thái</th><th>Nguồn ID</th><th>Ngày Tạo</th></tr></thead>
          <tbody>
            {items.map((i: any) => <tr key={i.id}><td>{i.id}</td><td>{i.ten_lead}</td><td>{i.trang_thai}</td><td>{i.nguon_id}</td><td>{i.ngay_tao}</td></tr>)}
          </tbody>
        </table>
      </div>
    )}
  </div>;
}
"""

content = content.replace("  </div>;\n}", mk_tables)

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
