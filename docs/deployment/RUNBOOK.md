# Triển khai Web-App-Template: prompt, code, sửa lỗi và đồng bộ GitHub

Repo chính: **https://github.com/gia417808-dot/Web-App-Template**.

Đã kiểm tra bằng Git ngày 29/09/2026: nhánh mặc định `main`, commit `7cc1dc2ba59c04e1d662fa6148861e6f1f9d271b`, cây mã có `README.md`. Chưa có package.json hoặc app. Đây là ảnh chụp tại thời điểm kiểm tra; agent phải kiểm tra lại trước sửa. Repo google-sheet cũ không còn là đích push của hệ thống này.

## 1. Kết quả sau từng giai đoạn

| Giai đoạn | Review | Plan | Act | Điều kiện chuyển bước |
|---|---|---|---|---|
| A. Kết nối | Git/đúng tài khoản/đúng repo | Clone và feature branch | Đưa kit vào repo | Kit check + test helper PASS |
| B. Nền tảng | Spec, môi trường, thư viện | ADR/DB/API/auth/UI/Excel engine | Agent viết mã CORE | Cài sạch, build/typecheck, login và DB test thật |
| C. Sản phẩm | Domain/schema/oracle | Một lát cắt hoàn chỉnh | Code database→domain→API→UI→Excel | G0/G1/Excel/Web/Ops có bằng chứng |
| D. Fix | Tái hiện lỗi và log gốc | Giả thuyết + test bắt lỗi | Sửa nguyên nhân nhỏ nhất | Test lỗi và regression liên quan PASS |
| E. Đồng bộ | Diff/secret/test/remote | Chọn file và commit | Commit/push feature branch | SHA local khớp nhánh remote |
| F. Nghiệm thu | 30 ID + integration + vận hành | Release candidate | Staging/private host/backup restore | Bằng chứng chạy thật, giới hạn rõ |

Chu trình bắt buộc mỗi nhiệm vụ: **Review → Plan → Act → Verify → Checkpoint → Sync**. Plan được cập nhật sau review; không code hàng loạt trước hiểu schema. Không coi GitHub có file là app đã deploy.

## 2. Chuẩn bị trên máy Windows

Mở Terminal PowerShell trong VS Code hoặc Antigravity. Cần Git, Python 3.10+ cho các script kèm theo. Đến CORE cần Node/npm và PostgreSQL hoặc Docker theo thiết kế agent đã khóa. VS Code là IDE; cần agent extension đang dùng có quyền đọc/ghi tệp và terminal. Gemini chat không có terminal không thể tự chứng minh lệnh đã chạy.

```powershell
git --version
py -3 --version
```

macOS/Linux dùng `python3` thay `py -3`. Không cần cài Google Drive/AppSheet để bắt đầu Web + Excel.

Đăng nhập GitHub bằng cách sẵn có trên máy. Nếu có GitHub CLI:

```powershell
gh auth login --hostname github.com --git-protocol https --web
gh auth status
gh auth setup-git
```

Nếu chưa có `gh`, vẫn dùng Git HTTPS qua credential manager hoặc SSH theo tài khoản. Không dán token vào chat, source, .env được commit hoặc URL remote. Việc clone được repo public không chứng minh có quyền push.

## 3. Clone và đưa bộ hồ sơ vào repo

Chọn một thư mục cha để chứa code, mở terminal tại đó. Nếu đã clone repo này rồi, mở bản clone hiện có; không clone đè.

```powershell
git clone https://github.com/gia417808-dot/Web-App-Template.git
cd Web-App-Template
git status
git branch --show-current
git remote get-url origin
```

Giải nén `WEB_APP_TEMPLATE_DEPLOYMENT.zip` ra ngoài thư mục repo. Trong thư mục vừa giải nén có `prepare_repo.py` và `payload/`. Mở terminal tại thư mục vừa giải nén, chạy 2 lệnh sau; thay đường dẫn ví dụ bằng đường dẫn repo thật:

```powershell
py -3 prepare_repo.py --repo "D:/Projects/Web-App-Template"
py -3 prepare_repo.py --repo "D:/Projects/Web-App-Template" --apply
```

Lệnh đầu chỉ xem trước. Lệnh thứ hai kiểm tra đúng origin/push URL, yêu cầu working tree sạch, tạo nhánh `feat/company-bootstrap` từ main đang mở và đưa file mới vào. Script **không commit/push**. Nó giữ README ban đầu và không ghi đè file khác nội dung; nếu gặp conflict, agent phải đọc/merge từng file. Nếu main đã có thay đổi remote, chạy fetch + pull --ff-only trên main sạch trước apply; không dựa mãi vào trạng thái repo mới tại ngày kiểm tra.

Mở lại **repo Web-App-Template** trong IDE, không mở nhầm folder ZIP:

```powershell
py -3 tools/deployment/repo_doctor.py
py -3 tools/deployment/verify_project.py --group bootstrap
py -3 planning/company-kit/scripts/rpa.py next
```

Kết quả ban đầu: bootstrap PASS; task kế tiếp AUDIT. `--group application` cố ý không PASS vì chưa có code ứng dụng.

## 4. Bố trí tệp đúng chỗ

| Đường dẫn trong repo | Vai trò |
|---|---|
| AGENTS.md / GEMINI.md / CLAUDE.md | Điểm vào hướng dẫn agent |
| planning/company-kit/ | Đặc tả 30 ID, kế hoạch 5 ngày, state/checkpoint và oracle |
| docs/deployment/ | Hướng dẫn này, prompt từng giai đoạn, quy trình Git/fix |
| tools/deployment/ | Script inventory, kiểm tra và Git preflight |
| apps/admin-web, apps/api, apps/catalog-web | Mã app agent sẽ tạo ở root repo |
| packages/domain, workbook-engine, ui, auth-audit | Thư viện dùng chung sẽ tạo ở root repo |
| products/<ID>/ | Implementation/fixtures/test theo ID sau audit, tham chiếu spec ở planning |
| db, infra | Migration và cấu hình host sẽ tạo khi CORE đủ thông tin |

Không code app dưới `planning/company-kit/apps`. Những README ở đó là hợp đồng kiến trúc tham chiếu. Agent tạo `governance/SPEC_IMPLEMENTATION_MAP.json` ở root để map spec→source và tránh 2 nguồn code trùng nhau. Quyết định nghiệp vụ cập nhật bản spec canonical trong planning; source schema/API cần kiểm tra đồng bộ.

## 5. Đưa prompt khởi động vào agent

Mở `docs/deployment/prompts/00_MASTER.md`, sao chép **toàn bộ** nội dung và gửi cho agent trong workspace. Agent phải thực thi AUDIT rồi CORE theo backlog, tự tiếp tục trong phạm vi được phép, không dừng sau một plan.

Sau AUDIT, agent ghi lệnh thực tế vào `docs/deployment/LOCAL_COMMANDS.md`; không dùng lệnh tưởng tượng. Repo mới chưa có `npm run dev`, `npm run build` hay `npm install` có ích cho app trước khi có package.json.

Để cập nhật checkpoint:

```powershell
py -3 planning/company-kit/scripts/rpa.py checkpoint AUDIT review --note "Đã đọc root, remote, nhánh và hiện trạng repo"
py -3 planning/company-kit/scripts/rpa.py checkpoint AUDIT plan --note "Đã chốt danh sách việc và bằng chứng audit cần thu"
py -3 planning/company-kit/scripts/rpa.py checkpoint AUDIT act --note "Đang kiểm tra môi trường và lập mapping"
py -3 planning/company-kit/scripts/rpa.py checkpoint AUDIT verify --note "Đang kiểm tra report audit"
```

Chỉ chạy những dòng trên khi việc tương ứng thực sự đã làm. DONE cần manifest đúng task/gate/hash; agent tạo từ log thật. Evidence trong bộ kit dùng đường dẫn tương đối **planning/company-kit**, không tương đối root repo. Ví dụ path của file log là `reports/evidence/AUDIT/run-01/review.md` trong kit. Không chép `manifest.example.json` rồi đổi tất cả thành PASS.

## 6. Code nền tảng CORE

Dùng prompt `01_CORE.md`. Kết quả CORE bắt buộc:

1. ADR khóa exact runtime/dependency, một package manager + lockfile. Repo mới không cần mang toàn bộ Google Sheets legacy sang.
2. TypeScript monorepo, frontend React, Node API, PostgreSQL theo kế hoạch. Tạo package scripts thật và README chạy local.
3. Đăng nhập owner, authorization server, organization scope, migration/master data/audit/row_version/idempotency.
4. Domain decimal: tiền nguyên VND, quantity decimal, làm tròn theo dòng; error/null reason, timezone nhất quán.
5. UI khung 6 phòng, catalog tách admin; route module chưa làm phải ghi chưa sẵn sàng.
6. Workbook-engine có Tables/validation/protection/meta; import preview→commit, kiểm tra version và formula injection.
7. Test build/typecheck/domain/auth/DB/roundtrip thật; không thay bằng test “file tồn tại”.
8. `deployment-checks.json` nhóm application có command thực. Trên Windows runner không chạy `.cmd/.bat`; dùng `node path/to/test-or-build-entry.mjs` hoặc agent tạo JS runner gọi API thư viện. Có thể chạy npm scripts thủ công trong terminal và lưu evidence riêng.

Sau CORE, lệnh cài/phát triển phải do agent cung cấp từ package.json thực. Ví dụ **chỉ nếu agent đã tạo npm scripts tương ứng và package-lock**:

```powershell
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Migration/seed ở đây chỉ cho DB local/demo đã cấu hình, không production. `npm ci` sẽ thất bại khi chưa có lockfile; lúc khởi tạo agent tạo lockfile bằng quy trình cài có kiểm soát rồi kiểm tra lại clean install. Không xóa lockfile để chữa mọi lỗi.

## 7. Code từng sản phẩm

Dùng `02_PRODUCT.md`. Thứ tự theo `rpa.py next`, sau CORE: **KV01 → KD01 → KT01 → KV02 → MK01**, rồi các ID còn lại theo dependency. KV01 tạo master hàng/kho để KD01 và KV02 dùng, không phải ưu tiên bán riêng mẫu đó.

Mỗi sản phẩm cần schema/fixtures/oracle, domain/API/UI, workbook thật, import/export, audit và test. Không mở 30 task cùng lúc. Những tính năng Google Sheets/AppSheet chỉ thêm khi được yêu cầu; Web/Excel là phạm vi hiện tại.

Các lệnh kiểm tra sau code:

```powershell
py -3 tools/deployment/verify_project.py --group application
git diff --check
git diff --stat
```

Agent tự đọc diff, chạy test hẹp bắt lỗi rồi regression cần thiết. Group application chưa có config phải báo NOT_RUN, không xóa check để xanh. G_EXCEL vẫn cần mở/tính lại Excel mục tiêu, build Web vẫn cần login/E2E; script run command không tự thay các gate đó.

## 8. Sửa lỗi có quy trình

Dùng `03_FIX.md`, đưa kèm nguyên lỗi + command + working directory; không chỉ nói “không chạy”. Agent đọc log ở `reports/local/verification/<run>/`, chọn lỗi gốc đầu tiên, tái hiện và ghi expected/actual. Log có thể chứa thông tin riêng: che bí mật trước chia sẻ.

| Biểu hiện | Kiểm tra | Cách xử lý |
|---|---|---|
| python/py không nhận | `py -3 --version` hoặc `python3 --version` | Dùng executable đã cài; mở lại terminal sau cài |
| `npm.ps1 cannot be loaded` | PowerShell execution policy | Có thể dùng `npm.cmd` thủ công hoặc terminal Command Prompt; không tắt policy toàn máy chỉ để vượt lỗi |
| package.json không tồn tại | Đang ở đúng repo chưa? CORE đã tạo chưa? | Về Git root; thực hiện CORE trước npm install/dev |
| `npm ci` thiếu/mismatch lock | Đọc package.json+lockfile+git diff | Sửa dependency đúng; cập nhật lock có chủ đích, rồi clean install lại |
| EADDRINUSE | Xác định process đang giữ cổng | Dừng đúng process của dự án hoặc đổi port config; không kill mọi Node |
| DB connection refused/auth failed | DB chạy? host/port/dbname/secret env đúng? | Sửa config, health check; không in password và không reset DB |
| Migration conflict | Schema hiện có và migration history | Review migration; backup; sửa forward migration phù hợp, không drop dữ liệu |
| 409 row_version | Client dùng version export cũ | Hiển thị conflict, tải version mới, merge có kiểm soát; không bỏ concurrency check |
| Formula/rounding khác | Oracle, decimal, rounding, Excel recalc | Sửa một contract thống nhất và test cả backend/Excel |
| Test 0 ca nhưng exit 0 | Test discovery/file rỗng | Viết oracle test thật và kiểm tra số ca; không coi exit code đơn độc là đủ |
| Git 403/repository not found | Tài khoản, repo spelling, quyền Contents | Đăng nhập đúng tài khoản có quyền; repo public đọc được không đồng nghĩa push được |
| non-fast-forward | Remote có commit mới | Fetch→review→merge nhánh remote thích hợp→sửa conflict→test→push; không force |
| Merge conflict | `git status`, marker <<<<<<< | Agent hợp nhất đúng ý nghĩa cả hai phía, test rồi commit; không chọn ours/theirs hàng loạt |
| CI fail nhưng local PASS | Runtime/env/OS/case-sensitive/import path | Tái hiện môi trường CI, fix nguyên nhân; không tắt job |

Mỗi lỗi lưu `docs/deployment/issues/<id>.md`: triệu chứng, tái hiện, nguyên nhân đã xác minh, file sửa, test trước/sau và phần còn mở. Nếu hai lần thử cùng cách không được, đổi giả thuyết dựa trên log; không chạy lệnh ngẫu nhiên.

## 9. Đồng bộ GitHub lần đầu

Sau bootstrap PASS, ở **root repo**:

```powershell
git status --short
git diff --check
git add -- .gitignore AGENTS.md GEMINI.md CLAUDE.md .github/copilot-instructions.md deployment-checks.json planning/company-kit docs/deployment tools/deployment
git diff --cached --stat
py -3 tools/deployment/git_preflight.py
git diff --cached
git commit -m "chore: bootstrap company system implementation kit"
git push -u origin feat/company-bootstrap
git rev-parse HEAD
git ls-remote --heads origin refs/heads/feat/company-bootstrap
```

Đọc nội dung staged trước commit. Hai SHA cuối phải giống nhau. Push thành công tạo nhánh trên GitHub; chưa merge main và chưa deploy app. Preflight chỉ chặn một số lỗi phổ biến, không thay review quyền/secret hoặc application tests.

Tạo pull request bằng GitHub giao diện: base `main`, compare `feat/company-bootstrap`. Nếu dùng GitHub CLI, có thể tạo draft PR (người dùng đã yêu cầu đồng bộ; agent vẫn không tự merge):

```powershell
gh pr create --draft --base main --head feat/company-bootstrap --title "Bootstrap company system implementation kit" --body-file docs/deployment/PR_BODY_BOOTSTRAP.md
```

Reviewer kiểm tra cấu trúc, bootstrap tests, diff và giới hạn. Khi bạn chấp nhận thì merge PR. Trước khi merge, các task code tiếp theo có thể dùng chính feature branch hoặc nhánh con có PR base đúng; cách dễ quản lý nhất là merge bootstrap rồi tạo `feat/core-foundation` từ main mới.

## 10. Đồng bộ sau từng lát cắt code

Đầu task, trên main sạch sau merge:

```powershell
git switch main
git fetch origin
git pull --ff-only origin main
git switch -c feat/core-foundation
```

Nếu nhánh đã tồn tại, dùng `git switch feat/core-foundation`; không tạo lại. Working tree đang dở thì checkpoint/review trước chuyển nhánh; không reset/stash tự động.

Sau code/fix/verify, agent stage **đúng file đã review**, ghi commit cụ thể, rồi:

```powershell
py -3 tools/deployment/git_preflight.py
git diff --cached
git commit -m "feat(core): add verified foundation"
git fetch origin
git merge origin/main
py -3 tools/deployment/verify_project.py --group application
git push -u origin feat/core-foundation
```

Chỉ chạy commit minh họa khi đã có chức năng tương ứng và test thật. Nếu `git merge` có conflict, dừng chuỗi tại đó, giải quyết rồi commit merge và test lại. Không tiếp tục push khi kiểm tra thất bại. Nếu cùng feature branch đã có thay đổi remote, fetch rồi merge `origin/feat/core-foundation` trước push; việc chỉ merge main không giải quyết diverged feature branch. Không dùng force-push.

Mỗi PR ghi vấn đề, thay đổi, kết quả test, migration/rủi ro và gate còn thiếu. Dùng body-file để giữ newline. PR module chưa có Excel QA không được mô tả là sản phẩm hoàn thiện.

## 11. Làm trên hai máy / đổi agent

- Máy A/B dùng clone riêng. Tránh cùng sửa cùng feature branch. Ví dụ A `feat/kd01`, B `feat/kt01`; schema chung chỉ một người/nhánh sở hữu trong mỗi đợt.
- Trước bắt đầu: fetch, đọc checkpoint và diff mới. Sau xong: commit/push nhánh của mình, PR tích hợp tuần tự, test trên code đã hợp nhất.
- Git không đồng bộ file chưa commit, .env, database hoặc file ignored. Không gửi secret qua commit để “đồng bộ cho đủ”. Tạo env riêng từng máy từ .env.example.
- state.json có thể conflict giữa nhánh; không chọn ours/theirs mù. Tổng hợp trạng thái từ evidence/revision thật; giữ task stale ở pending/review.
- Hết quota: lưu HANDOFF gồm branch/SHA, file chưa commit, lệnh đã chạy, lỗi còn mở, task và bước kế tiếp; dán `05_RESUME.md` vào agent mới. Nếu chưa push thì máy khác chưa có thay đổi đó.

## 12. Lịch 5 ngày và kết thúc

Ngày 1 audit/bootstrap/core; ngày 2 KD01/KT01/KV01/KV02; ngày 3 marketing và các luồng thương mại; ngày 4 HR/SX và workbook; ngày 5 regression/Excel/restore/host/UAT. Thứ tự dependency ưu tiên hơn thứ tự trình bày trong lịch. Mốc 29/09–03/10/2026 theo kế hoạch; nếu tiến độ thực không đạt, báo rõ số ID thiếu gate, không gọi toàn hệ thống hoàn tất.

GitHub lưu source. Ứng dụng 24/7 cần host riêng/private deployment, DB bền vững, restart policy, backup và monitor theo `planning/company-kit/docs/OPERATIONS_24_7.md`. Agent chưa tự có runner chạy sau khi tắt chat; dùng checkpoint để tiếp tục. Không tự tạo automation trả phí.

## Nguồn kỹ thuật
- https://git-scm.com/docs/git-push — semantics push và từ chối non-fast-forward.
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github — HTTPS/SSH authentication.
- https://cli.github.com/manual/gh_auth_login — đăng nhập qua browser/credential store.
- https://cli.github.com/manual/gh_pr_create — tạo PR và body-file.

Repo hiện tại được xác minh trực tiếp qua git ls-remote/clone, không dựa vào README của dự án cũ. Công cụ kèm theo không tự commit/push; mọi lệnh đồng bộ thực hiện trên máy người dùng/agent có quyền phù hợp.
