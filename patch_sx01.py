import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="SX02 - BOM" />',
    '<Tab label="SX02 - BOM" />\n          <Tab label="SX01 - Lệnh SX" />'
)

panel = '''      <TabPanel value={tabIndex} index={18}>
        <Typography variant="h6">Lệnh sản xuất (SX01)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Lệnh</TableCell>
                <TableCell>Mã SP</TableCell>
                <TableCell>Kế Hoạch</TableCell>
                <TableCell>Đạt</TableCell>
                <TableCell>Lỗi</TableCell>
                <TableCell>Tỷ Lệ</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>LSX-001</TableCell>
                <TableCell>SP-BAN-001</TableCell>
                <TableCell>100</TableCell>
                <TableCell>50</TableCell>
                <TableCell>2</TableCell>
                <TableCell>50.0%</TableCell>
                <TableCell>IN_PROGRESS</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Ghi Nhận</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
