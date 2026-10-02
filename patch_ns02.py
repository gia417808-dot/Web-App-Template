import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="NS01 - Nhân sự" />',
    '<Tab label="NS01 - Nhân sự" />\n          <Tab label="NS02 - Chấm công" />'
)

panel = '''      <TabPanel value={tabIndex} index={13}>
        <Typography variant="h6">Chấm công và ca (NS02)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nhân Sự ID</TableCell>
                <TableCell>Ca Làm</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Giờ Vào</TableCell>
                <TableCell>Giờ Ra</TableCell>
                <TableCell>Tổng Giờ</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>NV-001</TableCell>
                <TableCell>CA_NGAY</TableCell>
                <TableCell>2026-10-02</TableCell>
                <TableCell>08:15</TableCell>
                <TableCell>17:30</TableCell>
                <TableCell>-</TableCell>
                <TableCell>SUBMITTED</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Duyệt</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
