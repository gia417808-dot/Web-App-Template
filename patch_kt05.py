import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="KT04 - Ngân sách" />',
    '<Tab label="KT04 - Ngân sách" />\n          <Tab label="KT05 - Lãi gộp" />'
)

panel = '''      <TabPanel value={tabIndex} index={11}>
        <Typography variant="h6">Lãi gộp theo đơn (KT05)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Đơn Hàng ID</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Doanh Thu Thuần</TableCell>
                <TableCell>Tổng Giá Vốn</TableCell>
                <TableCell>Lãi Gộp</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>DH-2026-XYZ</TableCell>
                <TableCell>CALCULATED</TableCell>
                <TableCell>15,000,000</TableCell>
                <TableCell>10,000,000</TableCell>
                <TableCell>5,000,000</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Tính Lãi Gộp</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
