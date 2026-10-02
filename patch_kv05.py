import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="KV04 - Kiểm kê" />',
    '<Tab label="KV04 - Kiểm kê" />\n          <Tab label="KV05 - Cảnh báo bổ sung" />'
)

panel = '''      <TabPanel value={tabIndex} index={7}>
        <Typography variant="h6">Cảnh báo bổ sung (KV05)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Tồn Mục Tiêu</TableCell>
                <TableCell>Tồn Khả Dụng</TableCell>
                <TableCell>Lượng Gợi Ý</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>OPEN</TableCell>
                <TableCell>200</TableCell>
                <TableCell>50</TableCell>
                <TableCell>150</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Tiếp Nhận</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
