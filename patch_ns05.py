import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="NS04 - Lương QT" />',
    '<Tab label="NS04 - Lương QT" />\n          <Tab label="NS05 - Tuyển dụng" />'
)

panel = '''      <TabPanel value={tabIndex} index={16}>
        <Typography variant="h6">Tuyển dụng và cộng tác viên (NS05)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Họ Tên</TableCell>
                <TableCell>Vị Trí</TableCell>
                <TableCell>Ngày Mở</TableCell>
                <TableCell>Ngày Nhận</TableCell>
                <TableCell>Thời Gian Tuyển</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Trần Văn Tuyển</TableCell>
                <TableCell>Developer</TableCell>
                <TableCell>2026-09-01</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>INTERVIEW</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Chuyển Vòng</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
