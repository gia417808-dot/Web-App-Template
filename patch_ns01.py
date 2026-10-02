import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="KT05 - Lãi gộp" />',
    '<Tab label="KT05 - Lãi gộp" />\n          <Tab label="NS01 - Nhân sự" />'
)

panel = '''      <TabPanel value={tabIndex} index={12}>
        <Typography variant="h6">Hồ sơ nhân sự (NS01)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã NV</TableCell>
                <TableCell>Họ Tên</TableCell>
                <TableCell>Ngày Vào Làm</TableCell>
                <TableCell>Thâm Niên</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>NV-001</TableCell>
                <TableCell>Nguyễn Văn Admin</TableCell>
                <TableCell>2025-01-01</TableCell>
                <TableCell>365</TableCell>
                <TableCell>ACTIVE</TableCell>
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
