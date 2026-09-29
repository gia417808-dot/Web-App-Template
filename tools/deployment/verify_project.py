#!/usr/bin/env python3
"""Run explicit reviewed checks; an empty application check list fails closed."""
import argparse
import datetime
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]


def verify(group,config_path=None):
    config_path=config_path or ROOT/'deployment-checks.json'
    config=json.loads(config_path.read_text(encoding='utf-8'))
    group_config=config['groups'].get(group)
    if not group_config or not group_config.get('checks'):
        raise ValueError('Chưa cấu hình check cho '+group+'; NOT_RUN, không được coi PASS.')
    checks=group_config['checks']
    stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    report_dir=ROOT/'reports/local/verification'/stamp
    report_dir.mkdir(parents=True)
    results=[]
    for number,check in enumerate(checks,1):
        argv=check['argv']
        if not isinstance(argv,list) or not argv or not all(isinstance(x,str) for x in argv):
            raise ValueError('argv phải là mảng chuỗi, không phải shell command')
        argv=[sys.executable if x=='{python}' else x for x in argv]
        cwd=(ROOT/check.get('cwd','.')).resolve()
        if cwd != ROOT and ROOT not in cwd.parents:
            raise ValueError('cwd ngoài repo')
        executable=shutil.which(argv[0])
        if not executable:
            raise ValueError('Không tìm thấy executable: '+argv[0])
        argv[0]=executable
        # Do not accept Windows batch wrappers; use node test/build JS entrypoints there.
        if Path(executable).suffix.lower() in {'.cmd','.bat'}:
            raise ValueError('Dùng executable node/python trực tiếp thay .cmd/.bat trong runner; xem hướng dẫn Windows.')
        try:
            run=subprocess.run(argv,cwd=cwd,text=True,encoding='utf-8',errors='replace',
                               capture_output=True,timeout=check.get('timeout_seconds',600),shell=False)
            code=run.returncode;output=run.stdout+'\n'+run.stderr
        except subprocess.TimeoutExpired:
            code=124;output='TIMEOUT; kiểm tra process con trên máy. Không dùng watch/dev server trong verifier.'
        log=report_dir/f'{number:02d}.log';log.write_text(output,encoding='utf-8')
        results.append({'name':check['name'],'exit_code':code,'status':'PASS' if code==0 else 'FAIL',
                        'log':log.relative_to(ROOT).as_posix(),'argv':argv,'cwd':cwd.relative_to(ROOT).as_posix()})
        if code:
            break
    passed=len(results)==len(checks) and all(r['exit_code']==0 for r in results)
    report={'group':group,'scope':group_config['scope'],'status':'PASS' if passed else 'FAIL',
            'checks':results,'note':'Log có thể chứa dữ liệu dự án; review/redact trước khi commit. PASS bootstrap không phải PASS ứng dụng.'}
    (report_dir/'result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if passed else 1


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--group',choices=['bootstrap','application'],default='bootstrap')
    args=parser.parse_args()
    try:return verify(args.group)
    except (ValueError,KeyError,OSError) as error:
        print(str(error),file=sys.stderr);return 2


if __name__=='__main__':raise SystemExit(main())
