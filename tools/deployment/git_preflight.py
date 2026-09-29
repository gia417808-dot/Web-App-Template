#!/usr/bin/env python3
"""Check staged changes before a human/agent commits. Does not stage, commit or push."""
import re
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
EXPECTED='gia417808-dot/web-app-template'


def run(*args):
    result=subprocess.run(['git',*args],cwd=ROOT,capture_output=True)
    if result.returncode:raise ValueError('Git check thất bại: '+' '.join(args[:2]))
    return result.stdout


def identity(url):
    for prefix in ['https://github.com/','git@github.com:','ssh://git@github.com/']:
        if url.startswith(prefix):return url[len(prefix):].rstrip('/').removesuffix('.git').lower()
    raise ValueError('Origin không phải GitHub URL sạch; không nhúng token.')


def sensitive_path(path):
    parts=Path(path).parts;name=Path(path).name.lower()
    if name=='.env.example':return False
    return (name=='.env' or name.startswith('.env.') or
            name.startswith('credentials') or name.startswith('token') or
            name in {'.clasprc.json','id_rsa','id_ed25519'} or
            name.endswith(('.pem','.p12','.pfx','.key')) or
            any(p in {'node_modules','.venv','keys'} for p in parts))


def inspect():
    for args in [('remote','get-url','origin'),('remote','get-url','--push','origin')]:
        if identity(run(*args).decode().strip()) != EXPECTED:raise ValueError('Remote sai repository')
    branch=run('branch','--show-current').decode().strip()
    if not branch or branch in {'main','master','3.0.0-vi'}:
        raise ValueError('Dùng feature branch; không commit trực tiếp vào nhánh chính bằng workflow này')
    if run('diff','--name-only','--diff-filter=U').strip():raise ValueError('Còn merge conflict')
    run('diff','--cached','--check')
    names=[x.decode('utf-8') for x in run('diff','--cached','--name-only','-z').split(b'\0') if x]
    if not names:raise ValueError('Chưa stage file; dùng git add -- với đường dẫn đã review')
    blocked=[p for p in names if sensitive_path(p)]
    if blocked:raise ValueError('Có tệp nhạy cảm/build output đã stage: '+', '.join(blocked))
    # Check added text only. A heuristic is not a substitute for secret scanning/review.
    diff=run('diff','--cached','--no-ext-diff','--unified=0').decode('utf-8',errors='replace')
    added='\n'.join(line[1:] for line in diff.splitlines() if line.startswith('+') and not line.startswith('+++'))
    patterns=[r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
              r'gh[pousr]_[A-Za-z0-9]{30,}',r'github_pat_[A-Za-z0-9_]{40,}',
              r'AIza[0-9A-Za-z_-]{30,}']
    if any(re.search(pattern,added) for pattern in patterns):
        raise ValueError('Phát hiện chuỗi có dạng secret trong nội dung staged; không in giá trị. Review và thu hồi nếu đã lộ.')
    return {'status':'PASS','branch':branch,'staged_files':len(names),
            'warning':'Chỉ preflight Git; chưa chứng minh build/test, không thay scanner secret đầy đủ.'}


if __name__=='__main__':
    import json
    try:print(json.dumps(inspect(),ensure_ascii=False,indent=2))
    except (ValueError,OSError) as error:
        print(str(error));raise SystemExit(1)
