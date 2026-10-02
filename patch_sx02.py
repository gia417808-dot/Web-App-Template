import re

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Tab label="NS05 - Tuyển dụng" />',
    '<Tab label="NS05 - Tuyển dụng" />\n          <Tab label="SX02 - BOM" />'
)

panel = '''      <TabPanel value={tabIndex} index={17}>
        <Typography variant="h6">Định mức vật tư (SX02)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã SP</TableCell>
                <TableCell>Vật Tư</TableCell>
                <TableCell>Định Mức</TableCell>
                <TableCell>Hao Hụt (%)</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>SP-BAN-001</TableCell>
                <TableCell>Gỗ Sồi 1m3</TableCell>
                <TableCell>0.5</TableCell>
                <TableCell>10</TableCell>
                <TableCell>APPROVED</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">Dự Trù</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>'''

content = content.replace('    </Box>', panel + '\n    </Box>')

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
