import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="KT03 - Công nợ phải trả" />',
    '<Tab label="KT03 - Công nợ phải trả" />\n          <Tab label="KT04 - Ngân sách" />'
)

panel = '''      <TabPanel value={tabIndex} index={10}>
        <Typography variant="h6">Ngân sách thực chi (KT04)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kỳ</TableCell>
                <TableCell>Mã Ngân Sách</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Dự Toán</TableCell>
                <TableCell>Thực Chi</TableCell>
                <TableCell>Chênh Lệch</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>2026-01</TableCell>
                <TableCell>NS-2026-01-MKT</TableCell>
                <TableCell>APPROVED</TableCell>
                <TableCell>50,000,000</TableCell>
                <TableCell>20,000,000</TableCell>
                <TableCell>30,000,000</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Cập Nhật</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
