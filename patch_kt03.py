import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="KT02 - Công nợ phải thu" />',
    '<Tab label="KT02 - Công nợ phải thu" />\n          <Tab label="KT03 - Công nợ phải trả" />'
)

panel = '''      <TabPanel value={tabIndex} index={9}>
        <Typography variant="h6">Công nợ phải trả (KT03)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Phải Trả</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Số Gốc</TableCell>
                <TableCell>Đã Thanh Toán</TableCell>
                <TableCell>Còn Lại</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>PT-2026-02</TableCell>
                <TableCell>PARTIALLY_PAID</TableCell>
                <TableCell>10,000,000</TableCell>
                <TableCell>3,000,000</TableCell>
                <TableCell>7,000,000</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Đối Soát Chi</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
