#!/usr/bin/env python3
"""Read-only repo inventory. Does not print credentials or execute project scripts."""
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def command(*argv):
    result = subprocess.run(list(argv), cwd=ROOT, text=True, capture_output=True,encoding='utf-8')
    return result.returncode, result.stdout.strip()


def main():
    data = {'scope':'inventory_not_application_verification'}
    if not shutil.which('git'):
        print('Git chưa có trong PATH')
        return 1
    for name,args in [('branch',['git','branch','--show-current']),
                      ('revision',['git','rev-parse','HEAD']),
                      ('changes',['git','status','--short'])]:
        code,value=command(*args)
        data[name] = value if code == 0 else 'UNAVAILABLE'
    data['python_available']=True
    data['node_available']=bool(shutil.which('node'))
    if data['node_available']:
        data['node_version']=command('node','--version')[1]
    package=ROOT/'package.json'
    data['package_json_exists']=package.is_file()
    data['package_scripts']=json.loads(package.read_text(encoding='utf-8')).get('scripts',{}) if package.is_file() else {}
    data['lockfiles']=[p for p in ['package-lock.json','pnpm-lock.yaml','yarn.lock'] if (ROOT/p).is_file()]
    data['next']='Đọc planning/company-kit/work/HANDOFF.md; thiếu package.json ở repo mới là chưa triển khai CORE.'
    print(json.dumps(data,ensure_ascii=False,indent=2))
    return 0


if __name__=='__main__':raise SystemExit(main())
