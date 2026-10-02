import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="NS03 - Nghỉ phép" />',
    '<Tab label="NS03 - Nghỉ phép" />\n          <Tab label="NS04 - Lương QT" />'
)

panel = '''      <TabPanel value={tabIndex} index={15}>
        <Typography variant="h6">Lương quản trị (NS04)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kỳ Lương</TableCell>
                <TableCell>Nhân Sự ID</TableCell>
                <TableCell>Lương Thỏa Thuận</TableCell>
                <TableCell>Thực Nhận</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>2026-10</TableCell>
                <TableCell>NV-001</TableCell>
                <TableCell>20,000,000</TableCell>
                <TableCell>21,500,000</TableCell>
                <TableCell>REVIEWED</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Chốt Lương</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
