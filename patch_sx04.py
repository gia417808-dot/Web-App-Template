import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="SX03 - Tiến Độ" />',
    '<Tab label="SX03 - Tiến Độ" />\n          <Tab label="SX04 - Chất Lượng" />'
)

panel = '''      <TabPanel value={tabIndex} index={20}>
        <Typography variant="h6">Chất lượng và lỗi (SX04)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lệnh SX</TableCell>
                <TableCell>SL Kiểm</TableCell>
                <TableCell>SL Lỗi</TableCell>
                <TableCell>Tỷ Lệ</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>LSX-001</TableCell>
                <TableCell>100</TableCell>
                <TableCell>5</TableCell>
                <TableCell>5.0%</TableCell>
                <TableCell>INSPECTED</TableCell>
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
