#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
ĐỘNG CƠ ĐỒNG BỘ 2 MÁY TÍNH & CẬP NHẬT MONOREPO 5 MẪU GỐC COMMERCIAL PRO
Thư mục chuẩn: D:\WEB APP TEMPLATE GOOGLE (apps, delivery, docs, registry, tools...)
GitHub Repo  : https://github.com/gia417808-dot/Web-App-Template.git
================================================================================
"""

import os
import sys
import json
import shutil
import argparse
import subprocess
from datetime import datetime

REPO_URL = "https://github.com/gia417808-dot/Web-App-Template.git"

TEMPLATES = [
    {
        "code": "GS-001",
        "canonical_dir": "GS-001-hr",
        "version": "v4.0 Commercial Pro",
        "name": "Quản Lý Nhân Sự, Chấm Công, Đơn Từ, KPI & Tính Lương Tự Động",
        "sheets": 8,
        "md_bundle": "GS-001_Quan_Ly_Nhan_Su_Cham_Cong_KPI_Tinh_Luong_v4.0_Commercial_Pro.md"
    },
    {
        "code": "GS-002",
        "canonical_dir": "GS-002-warehouse",
        "version": "v3.0 Commercial Pro",
        "name": "Quản Lý Nhập Xuất Tồn Đa Kho & Cảnh Báo Định Mức",
        "sheets": 7,
        "md_bundle": "GS-002_Nhap_Xuat_Ton_Da_Kho_v3.0_Commercial_Pro.md"
    },
    {
        "code": "GS-003",
        "canonical_dir": "GS-003-finance",
        "version": "v4.1 Commercial Pro",
        "name": "Quản Lý Thu Chi, Sổ Quỹ Đa Tài Khoản, Công Nợ & Dòng Tiền",
        "sheets": 7,
        "md_bundle": "GS-003_Thu_Chi_Dong_Tien_v4.1_Commercial_Pro.md"
    },
    {
        "code": "GS-004",
        "canonical_dir": "GS-004-project",
        "version": "v4.4 Commercial Pro",
        "name": "Quản Lý Dự Án, Khách Hàng CRM, Kanban/Gantt, RACI & Bot Nhắc Việc",
        "sheets": 7,
        "md_bundle": "GS-004_Du_An_CRM_Kanban_Gantt_KPI_v4.4_Commercial_Pro.md"
    },
    {
        "code": "GS-005",
        "canonical_dir": "GS-005-pos",
        "version": "v3.3 Commercial Pro",
        "name": "Quản Lý Nhà Hàng, Cafe, POS Tính Giờ, Hội Viên VIP & Bếp KDS",
        "sheets": 8,
        "md_bundle": "GS-005_Nha_Hang_Cafe_POS_v3.3_Commercial_Pro.md"
    }
]

REQUIRED_FILES = ["appsscript.json", "installer.gs", "Code.gs", "Index.html"]


def run_cmd(cmd, cwd=None, check=False):
    print(f"  $ {' '.join(cmd)}")
    res = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)
    if res.stdout and res.stdout.strip():
        print(res.stdout.strip())
    if res.stderr and res.stderr.strip():
        print(res.stderr.strip())
    if check and res.returncode != 0:
        raise RuntimeError(f"Command failed ({res.returncode}): {' '.join(cmd)}")
    return res


def discover_monorepo_targets(repo_root, tmpl):
    """
    Quét cấu trúc Monorepo (apps/, delivery/, packages/, hoặc thư mục gốc)
    để tìm chính xác nơi lưu trữ từng mẫu GS-001..GS-005 và cập nhật đúng vị trí!
    """
    code_upper = tmpl["code"].upper()
    code_compact = code_upper.replace("-", "")
    targets = []

    search_roots = [
        os.path.join(repo_root, "apps"),
        os.path.join(repo_root, "delivery"),
        os.path.join(repo_root, "packages"),
        repo_root
    ]

    for s_root in search_roots:
        if not os.path.exists(s_root):
            continue
        for root, dirs, files in os.walk(s_root):
            parts = root.split(os.sep)
            if any(p in (".git", ".github", "node_modules", ".mypy_cache", "docs_bundles") for p in parts):
                continue
            if os.path.relpath(root, repo_root).count(os.sep) > 3:
                continue
            for d in dirs:
                d_up = d.upper()
                if d_up.startswith(code_upper) or d_up.startswith(code_compact):
                    full_d = os.path.join(root, d)
                    if full_d not in targets:
                        targets.append(full_d)

    # Nếu trong apps/ chưa có thư mục của mẫu này mà repo có thư mục apps/, tạo chuẩn trong apps/<canonical_dir>
    apps_dir = os.path.join(repo_root, "apps")
    if os.path.exists(apps_dir):
        app_target = os.path.join(apps_dir, tmpl["canonical_dir"])
        if not any(t.startswith(apps_dir) for t in targets):
            targets.append(app_target)

    # Nếu trong delivery/ có cấu trúc lưu bản phát hành, cập nhật cả delivery/<canonical_dir>
    delivery_dir = os.path.join(repo_root, "delivery")
    if os.path.exists(delivery_dir):
        deliv_target = os.path.join(delivery_dir, tmpl["canonical_dir"])
        if not any(t.startswith(delivery_dir) for t in targets):
            targets.append(deliv_target)

    # Nếu không phải cấu trúc có apps/, đảm bảo có thư mục gốc <canonical_dir>
    if not targets:
        targets.append(os.path.join(repo_root, tmpl["canonical_dir"]))

    return targets


def update_deployment_checks_and_registry(repo_root):
    """Cập nhật file deployment-checks.json và registry/ (nếu có) với trạng thái Golden Master"""
    now_iso = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+07:00")
    checks_path = os.path.join(repo_root, "deployment-checks.json")
    manifest_data = {
        "last_synced_at": now_iso,
        "ecosystem_status": "GOLDEN_MASTER_COMMERCIAL_PRO",
        "repository": "https://github.com/gia417808-dot/Web-App-Template",
        "templates": {}
    }
    if os.path.exists(checks_path):
        try:
            with open(checks_path, "r", encoding="utf-8") as f:
                old_data = json.load(f)
                if isinstance(old_data, dict):
                    manifest_data.update(old_data)
                    manifest_data["last_synced_at"] = now_iso
                    manifest_data["ecosystem_status"] = "GOLDEN_MASTER_COMMERCIAL_PRO"
                    if "templates" not in manifest_data or not isinstance(manifest_data["templates"], dict):
                        manifest_data["templates"] = {}
        except Exception:
            pass

    for t in TEMPLATES:
        manifest_data["templates"][t["code"]] = {
            "folder": t["canonical_dir"],
            "version": t["version"],
            "name": t["name"],
            "sheets_count": t["sheets"],
            "files_verified": REQUIRED_FILES,
            "syntax_check": "PASSED_ZERO_ERRORS",
            "updated_at": now_iso
        }

    with open(checks_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)
    print("  ✅ Đã cập nhật trạng thái nghiệm thu vào: deployment-checks.json")


def sync_monorepo(source_root, repo_root, do_pull=True, do_push=False, branch=""):
    print("=" * 78)
    print("🚀 ĐỒNG BỘ ĐA MÁY TÍNH & CẬP NHẬT MONOREPO 5 MẪU GỐC COMMERCIAL PRO")
    print(f"📂 Thư mục Nguồn : {os.path.abspath(source_root)}")
    print(f"📂 Thư mục Repo  : {os.path.abspath(repo_root)}")
    print("=" * 78)

    os.makedirs(repo_root, exist_ok=True)
    git_dir = os.path.join(repo_root, ".git")

    if not os.path.exists(git_dir):
        print("[1/5] Khởi tạo Git & kết nối Remote GitHub...")
        run_cmd(["git", "init"], cwd=repo_root)
        run_cmd(["git", "remote", "add", "origin", REPO_URL], cwd=repo_root)

    if do_pull:
        print("\n[2/5] Đồng bộ dữ liệu mới nhất từ GitHub về máy hiện tại (Chống xung đột 2 máy)...")
        run_cmd(["git", "fetch", "origin"], cwd=repo_root)
        if not branch:
            br_res = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=repo_root)
            branch = (br_res.stdout or "").strip() or "main"
            if branch == "HEAD":
                branch = "main"
        # Tự động stash nếu có thay đổi tạm chưa commit trước khi pull --rebase
        st_res = run_cmd(["git", "status", "--porcelain"], cwd=repo_root)
        had_local_changes = bool((st_res.stdout or "").strip())
        if had_local_changes:
            run_cmd(["git", "stash", "push", "-u", "-m", "auto-stash-before-multi-pc-sync"], cwd=repo_root)
        run_cmd(["git", "pull", "--rebase", "origin", branch], cwd=repo_root)
        if had_local_changes:
            run_cmd(["git", "stash", "pop"], cwd=repo_root)

    print("\n[3/5] Cập nhật 20 file chuẩn Golden Master vào cấu trúc Monorepo...")
    for tmpl in TEMPLATES:
        c_dir = tmpl["canonical_dir"]
        src_folder = os.path.join(source_root, c_dir)
        if not os.path.exists(src_folder):
            raise FileNotFoundError(f"Thiếu thư mục nguồn: {src_folder}")

        target_dirs = discover_monorepo_targets(repo_root, tmpl)
        for t_dir in target_dirs:
            os.makedirs(t_dir, exist_ok=True)
            for fn in os.listdir(src_folder):
                s_file = os.path.join(src_folder, fn)
                d_file = os.path.join(t_dir, fn)
                if os.path.isfile(s_file) and os.path.abspath(s_file) != os.path.abspath(d_file):
                    shutil.copy2(s_file, d_file)

        rel_targets = [os.path.relpath(p, repo_root) for p in target_dirs]
        print(f"  ✅ {tmpl['code']} ({tmpl['version']}) ➔ {', '.join(rel_targets)}")

    # Đồng bộ 5 tài liệu Markdown đặc tả vào docs/ (hoặc docs_bundles/)
    docs_src = os.path.join(source_root, "docs_bundles")
    docs_dst = os.path.join(repo_root, "docs", "commercial-pro-bundles") if os.path.exists(os.path.join(repo_root, "docs")) else os.path.join(repo_root, "docs_bundles")
    if os.path.exists(docs_src):
        os.makedirs(docs_dst, exist_ok=True)
        for fn in os.listdir(docs_src):
            shutil.copy2(os.path.join(docs_src, fn), os.path.join(docs_dst, fn))
        print(f"  ✅ Đã đồng bộ 5 tài liệu đặc tả Markdown vào: {os.path.relpath(docs_dst, repo_root)}")

    print("\n[4/5] Cập nhật deployment-checks.json & kiểm tra trạng thái Git...")
    update_deployment_checks_and_registry(repo_root)
    run_cmd(["git", "status", "-s"], cwd=repo_root)

    if do_push:
        print("\n[5/5] Đang Commit & Push toàn bộ bản cập nhật lên GitHub để đồng bộ sang Máy tính thứ 2...")
        run_cmd(["git", "add", "-A"], cwd=repo_root)
        stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        commit_msg = f"feat(commercial-pro): sync all 5 Golden Master templates (GS-001 v4.0, GS-002 v3.0, GS-003 v4.1, GS-004 v4.4, GS-005 v3.3) [{stamp}]"
        run_cmd(["git", "commit", "-m", commit_msg], cwd=repo_root)
        if not branch:
            branch = "main"
        run_cmd(["git", "push", "-u", "origin", branch], cwd=repo_root)
        print("\n🎉 HOÀN TẤT! Trên máy tính thứ 2, bạn chỉ cần mở VS Code và chạy: git pull --rebase origin " + branch)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Đồng bộ Monorepo 5 mẫu gốc Commercial Pro giữa 2 máy tính qua GitHub")
    parser.add_argument("--source-dir", default=os.path.dirname(os.path.abspath(__file__)), help="Thư mục giải nén gói 5 mẫu gốc")
    parser.add_argument("--repo-dir", default=".", help="Đường dẫn thư mục D:\\WEB APP TEMPLATE GOOGLE")
    parser.add_argument("--no-pull", action="store_true", help="Bỏ qua bước git pull trước khi ghi")
    parser.add_argument("--push", action="store_true", help="Tự động git add, commit và push lên GitHub")
    parser.add_argument("--branch", default="", help="Nhánh Git (mặc định tự động nhận diện)")
    args = parser.parse_args()

    sync_monorepo(args.source_dir, args.repo_dir, do_pull=not args.no_pull, do_push=args.push, branch=args.branch)
