import sys

with open('apps/admin-web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("<button onClick={() => setActiveTab('KD05')}>Cham soc (KD05)</button>\n    </div>", "<button onClick={() => setActiveTab('KD05')}>Cham soc (KD05)</button>\n      <button onClick={() => setActiveTab('MK02')}>Chiến Dịch (MK02)</button>\n      <button onClick={() => setActiveTab('MK03')}>Lead Nguồn (MK03)</button>\n    </div>")

with open('apps/admin-web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
