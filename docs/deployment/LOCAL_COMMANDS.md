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

## Application Commands
To run the CORE services, you can use the following commands from the project root:

```powershell
# Install dependencies
npm install

# Run all application checks and unit tests
npm run test --workspaces --if-present

# Build the project
npm run build --workspaces --if-present

# Start development server
npm run dev --workspaces --if-present

# Database Migration
npm run db:migrate --workspace=apps/api

# Database Seeding
npm run db:seed --workspace=apps/api

# Generate Workbook
npm run workbook:generate --workspace=packages/workbook-engine
```
