import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="KV05 - Cảnh báo bổ sung" />',
    '<Tab label="KV05 - Cảnh báo bổ sung" />\n          <Tab label="KT02 - Công nợ phải thu" />'
)

panel = '''      <TabPanel value={tabIndex} index={8}>
        <Typography variant="h6">Công nợ phải thu (KT02)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Phải Thu</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Số Gốc</TableCell>
                <TableCell>Đã Thanh Toán</TableCell>
                <TableCell>Còn Lại</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>PT-2026-01</TableCell>
                <TableCell>PARTIALLY_PAID</TableCell>
                <TableCell>5,000,000</TableCell>
                <TableCell>2,000,000</TableCell>
                <TableCell>3,000,000</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Đối Soát Thu</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
