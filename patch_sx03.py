import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="SX01 - Lệnh SX" />',
    '<Tab label="SX01 - Lệnh SX" />\n          <Tab label="SX03 - Tiến Độ" />'
)

panel = '''      <TabPanel value={tabIndex} index={19}>
        <Typography variant="h6">Tiến độ công đoạn (SX03)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lệnh SX</TableCell>
                <TableCell>Công Đoạn</TableCell>
                <TableCell>Trọng Số</TableCell>
                <TableCell>Tỷ Lệ Đạt</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>LSX-001</TableCell>
                <TableCell>Cắt Gỗ</TableCell>
                <TableCell>1</TableCell>
                <TableCell>50.0%</TableCell>
                <TableCell>IN_PROGRESS</TableCell>
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
