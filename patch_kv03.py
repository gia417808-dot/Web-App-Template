import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="MK05 - Thử nghiệm nội dung" />',
    '<Tab label="MK05 - Thử nghiệm nội dung" />\n          <Tab label="KV03 - Mua hàng" />'
)

panel = '''      <TabPanel value={tabIndex} index={5}>
        <Typography variant="h6">Mua hàng (KV03)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Đơn</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Lượng Đặt</TableCell>
                <TableCell>Lượng Nhận</TableCell>
                <TableCell>Chênh Lệch</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>PO-2026-001</TableCell>
                <TableCell>APPROVED</TableCell>
                <TableCell>100</TableCell>
                <TableCell>0</TableCell>
                <TableCell>100</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Đặt Mua</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
