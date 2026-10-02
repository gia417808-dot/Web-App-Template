const fs = require('fs');
let content = fs.readFileSync('apps/admin-web/src/App.tsx', 'utf8');

// replace 1: add to union
content = content.replace(/'KD04'>\('KV01'\)/, "'KD04' | 'KD05'>('KV01')");

// replace 2: add URL mapping
content = content.replace(/if \(activeTab === 'KD04'\) url = '\/api\/kd04\/hopdong';/, "if (activeTab === 'KD04') url = '/api/kd04/hopdong';\n    if (activeTab === 'KD05') url = '/api/kd05/customers-care-status';");

// replace 3: add tab button
content = content.replace(/<button onClick=\{\(\) => setActiveTab\('KD04'\)\}>([^<]+)<\/button>/, "<button onClick={() => setActiveTab('KD04')}>\</button>\n      <button onClick={() => setActiveTab('KD05')}>Chăm sóc (KD05)</button>");

// replace 4: add table rendering
const newRender =     {activeTab === 'KD05' && (
      <table>
        <thead><tr><th>Tên KH</th><th>Mã KH</th><th>Tương Tác Cuối</th><th>Trễ (Ngày)</th><th>Lập Lịch</th></tr></thead>
        <tbody>
          {items.map((i: any) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.code}</td>
              <td>{i.last_interaction ? new Date(i.last_interaction.interaction_date).toLocaleDateString() : 'Chưa có'}</td>
              <td>{i.days_since_last_interaction === 'NO_CONTACT' ? 'NO_CONTACT' : i.days_since_last_interaction}</td>
              <td>
                <button onClick={() => {
                  fetch('/api/kd05/interactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'org-123' },
                    body: JSON.stringify({ customer_id: i.id, type: 'Call', interaction_date: new Date() })
                  })
                  .then(async r => {
                    if (!r.ok) {
                      const body = await r.json();
                      alert(body.error || 'Lỗi đặt lịch');
                    } else {
                      alert('Đã lên lịch thành công');
                    }
                  })
                  .catch(e => alert(e.message));
                }}>Lập Lịch</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>;
};
content = content.replace(/  <\/div>;\r?\n\}/, newRender);

fs.writeFileSync('apps/admin-web/src/App.tsx', content, 'utf8');