# Lệnh đang có thật

Từ root Web-App-Template sau prepare_repo:

```powershell
py -3 tools/deployment/repo_doctor.py
py -3 tools/deployment/verify_project.py --group bootstrap
py -3 planning/company-kit/scripts/rpa.py next
py -3 tools/deployment/git_preflight.py
```

Preflight yêu cầu feature branch và có file đã stage; chưa stage là lỗi đúng dự kiến. `verify_project --group application` sẽ báo chưa cấu hình, không phải lỗi cần bỏ check.

CORE phải bổ sung vào đây lệnh install/dev/build/typecheck/unit/integration/E2E/migrate/seed/workbook/backup thật, cwd, prerequisite và env names. Không ghi secret hoặc điền lệnh chưa tồn tại. PowerShell dùng py -3; macOS/Linux python3. Runner Python không hỗ trợ wrapper .cmd/.bat; khi cấu hình application checks trên Windows hãy dùng node/Python executable và entrypoint thật, hoặc chạy npm scripts trực tiếp trong terminal và giữ log riêng.

Lệnh tạo Excel MK03:
```powershell
& "C:/Users/MSI PC/.gemini/antigravity/scratch/ui_testing_dashboard/node-portable/node.exe" tools/generate_mk03_sample.js
```
Lệnh typecheck / build app:
```powershell
& "C:/Users/MSI PC/.gemini/antigravity/scratch/ui_testing_dashboard/node-portable/node.exe" "C:/Users/MSI PC/.gemini/antigravity/scratch/ui_testing_dashboard/node-portable/node_modules/npm/bin/npm-cli.js" run build --workspaces
```
