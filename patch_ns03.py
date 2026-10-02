import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="NS02 - Chấm công" />',
    '<Tab label="NS02 - Chấm công" />\n          <Tab label="NS03 - Nghỉ phép" />'
)

panel = '''      <TabPanel value={tabIndex} index={14}>
        <Typography variant="h6">Nghỉ phép (NS03)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nhân Sự ID</TableCell>
                <TableCell>Năm</TableCell>
                <TableCell>Đầu Kỳ</TableCell>
                <TableCell>Phát Sinh</TableCell>
                <TableCell>Đã Duyệt</TableCell>
                <TableCell>Còn Lại</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>NV-001</TableCell>
                <TableCell>2026</TableCell>
                <TableCell>0</TableCell>
                <TableCell>12</TableCell>
                <TableCell>2</TableCell>
                <TableCell>10</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Duyệt Đơn Nháp</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
