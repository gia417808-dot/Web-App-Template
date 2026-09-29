# Lệnh thực tế

Đang dùng được cho bộ hồ sơ:
```sh
python scripts/rpa.py check
python scripts/rpa.py next
python -m unittest discover -s tests -v
```

Chưa có lệnh chạy app/database/workbook generation. Task CORE phải ghi chính xác ở đây: install frozen-lockfile, dev, build, typecheck, unit/integration/E2E, migration, seed, generate workbook, backup/restore staging. Mỗi lệnh cần working directory, prerequisite, env name (không value secret), exit expectation và cách dừng. Không hướng dẫn chạy `npm run dev` khi package.json chưa tồn tại.
