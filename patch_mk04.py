import os

path = 'apps/admin-web/src/App.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<Tab label="MK03 - Lead theo nguồn" />', '<Tab label="MK03 - Lead theo nguồn" />\n          <Tab label="MK04 - Hiệu quả kênh" />')

panel = """
      <TabPanel value={tabIndex} index={3}>
        <Typography variant="h6">Hiệu quả kênh (MK04)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kênh/Nguồn</TableCell>
                <TableCell>Kỳ Báo Cáo</TableCell>
                <TableCell>Tổng Chi Phí</TableCell>
                <TableCell>Số Lead Hợp Lệ</TableCell>
                <TableCell>CPL (VND)</TableCell>
                <TableCell>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Facebook Ads</TableCell>
                <TableCell>2026-01-01 -&gt; 2026-01-31</TableCell>
                <TableCell>15,000,000</TableCell>
                <TableCell>150</TableCell>
                <TableCell>100,000</TableCell>
                <TableCell>VERIFIED</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
"""

# Replace the closing </Box> at the end with our panel + </Box>
if 'index={3}' not in content:
    content = content.replace('    </Box>\n  );\n}\n\nexport default App;\n', panel + '  );\n}\n\nexport default App;\n')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
