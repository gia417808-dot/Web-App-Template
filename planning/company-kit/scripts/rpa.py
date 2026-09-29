#!/usr/bin/env python3
"""Portable task/checkpoint helper. Does not execute AI or application commands."""
import argparse
import hashlib
import json
import os
import sys
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ACTIVE = {'review', 'plan', 'act', 'verify'}
TRANSITIONS = {
    'pending': {'review', 'blocked'},
    'review': {'plan', 'blocked'},
    'plan': {'act', 'blocked'},
    'act': {'verify', 'blocked'},
    'verify': {'done', 'act', 'blocked'},
    'blocked': {'review'},
    'done': set(),
}


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def load():
    return read(ROOT / 'work/tasks.json')['tasks'], read(ROOT / 'work/state.json')


def within(path, parent):
    return path == parent or parent in path.parents


def local_file(relative, parent=None):
    if not isinstance(relative, str) or Path(relative).is_absolute():
        raise ValueError('Evidence path phải tương đối gốc kit')
    path = (ROOT / relative).resolve()
    allowed = (parent or ROOT).resolve()
    if not within(path, allowed) or not path.is_file() or path.stat().st_size == 0:
        raise ValueError('Evidence file thiếu/rỗng hoặc ngoài phạm vi: ' + relative)
    return path


def validate_evidence(task, relative):
    base = ROOT / 'reports/evidence'
    path = local_file(relative, base)
    data = read(path)
    if data.get('task_id') != task['id']:
        raise ValueError('Evidence sai task_id')
    for key in ('source_revision', 'environment', 'reviewer'):
        value = data.get(key)
        if not isinstance(value, str) or not value.strip() or 'REPLACE_' in value:
            raise ValueError('Evidence thiếu giá trị thật: ' + key)
    stamp = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
    if stamp.tzinfo is None:
        raise ValueError('Timestamp phải có timezone')
    gates = data.get('gates', [])
    gate_map = {g['id']: g for g in gates}
    if len(gate_map) != len(gates):
        raise ValueError('Gate trùng')
    for gate_id in task['required_gates']:
        gate = gate_map.get(gate_id)
        if not gate or gate.get('status') != 'PASS':
            raise ValueError('Gate chưa PASS: ' + gate_id)
        for key in ('expected', 'actual', 'command'):
            if not isinstance(gate.get(key), str) or not gate[key].strip() or gate[key] == 'NOT_RUN':
                raise ValueError('Gate thiếu ' + key)
        if gate['command'].startswith('MANUAL:'):
            if gate.get('exit_code') is not None:
                raise ValueError('Manual QA dùng exit_code null')
        elif type(gate.get('exit_code')) is not int or gate['exit_code'] != 0:
            raise ValueError('Lệnh gate phải có exit_code 0')
        files = gate.get('files', [])
        if not files:
            raise ValueError('Gate thiếu file bằng chứng')
        for item in files:
            file = local_file(item['path'], base)
            if file == path:
                raise ValueError('Manifest không tự là bằng chứng của chính nó')
            if hashlib.sha256(file.read_bytes()).hexdigest() != item.get('sha256'):
                raise ValueError('Hash evidence không khớp: ' + item['path'])
    return data


@contextmanager
def state_lock():
    path = ROOT / 'work/.state.lock'
    try:
        descriptor = os.open(str(path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise ValueError('State đang khóa. Xác minh process trước khi xử lý lock stale.')
    try:
        os.write(descriptor, str(os.getpid()).encode())
        os.close(descriptor)
        yield
    finally:
        path.unlink(missing_ok=True)


def save(state):
    path = ROOT / 'work/state.json'
    temp = path.with_suffix('.json.tmp')
    with temp.open('w', encoding='utf-8') as stream:
        json.dump(state, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temp, path)


def graph_check(tasks):
    by_id = {t['id']: t for t in tasks}
    if len(tasks) != len(by_id):
        raise ValueError('Task ID trùng')
    visited, active = set(), set()
    def visit(id):
        if id not in by_id:
            raise ValueError('Phụ thuộc không tồn tại: ' + id)
        if id in active:
            raise ValueError('Dependency cycle: ' + id)
        if id in visited:
            return
        active.add(id)
        for dep in by_id[id]['depends_on']:
            visit(dep)
        active.remove(id)
        visited.add(id)
    for id in by_id:
        visit(id)


def check():
    tasks, state = load()
    graph_check(tasks)
    if {t['id'] for t in tasks} != set(state['tasks']):
        raise ValueError('State/task ID không khớp')
    if sum(s['phase'] in ACTIVE for s in state['tasks'].values()) > 1:
        raise ValueError('Có nhiều hơn một task active')
    for id, item in state['tasks'].items():
        if item['phase'] not in TRANSITIONS:
            raise ValueError('Phase không hợp lệ: ' + id)
    catalog = read(ROOT / 'governance/PRODUCT_CATALOG.json')
    expected = {f'{prefix}{i:02}' for prefix in ['KD','NS','MK','KT','SX','KV'] for i in range(1,6)}
    if len(catalog) != 30 or {p['id'] for p in catalog} != expected:
        raise ValueError('Catalog phải có đúng 30 ID')
    all_tasks = {t['id'] for t in tasks}
    for product in catalog:
        id = product['id']
        if id not in all_tasks:
            raise ValueError('Sản phẩm thiếu task')
        folder = ROOT / 'products' / id
        for relative in ['product.yaml','README.md','DOMAIN_SPEC.md','PRD.md',
                         'schema/DATA_MODEL.md','schema/entity-map.json','schema/calculation-input.schema.json',
                         'formulas/FORMULA_CONTRACT.md','formulas/contract.json',
                         'fixtures/calculator-demo.json','fixtures/SEED_PLAN.md',
                         'server/IMPLEMENTATION.md','web/UI_SPEC.md',
                         'workbook/WORKBOOK_SPEC.md','tests/TEST_PLAN.md','tests/oracle.json']:
            if not (folder / relative).is_file() or not (folder / relative).stat().st_size:
                raise ValueError(id + ' thiếu ' + relative)
        manifest = read(folder / 'product.yaml')
        if manifest['id'] != id:
            raise ValueError('Sai product manifest')
        schema = read(folder / 'schema/calculation-input.schema.json')
        contract = read(folder / 'formulas/contract.json')
        if set(contract['inputs']) != set(schema['required']):
            raise ValueError('Schema/contract không khớp')
        oracle = read(folder / 'tests/oracle.json')
        if len(oracle['cases']) < 2 or len({c['case'] for c in oracle['cases']}) != len(oracle['cases']):
            raise ValueError('Oracle thiếu/trùng case')
        for case in oracle['cases']:
            if set(case['input']) != set(contract['inputs']) or 'expected' not in case:
                raise ValueError('Oracle sai input hoặc thiếu expected')
        rows = read(folder / 'fixtures/calculator-demo.json')['rows']
        if len(rows) != 30 or len({r['demo_id'] for r in rows}) != 30:
            raise ValueError('Demo rows thiếu/trùng ID')
    dictionary = read(ROOT / 'db/LOGICAL_DATA_DICTIONARY.json')['entities']
    for name, entity in dictionary.items():
        for column in entity.get('columns', []):
            if column.get('reference') and column['reference'] not in dictionary:
                raise ValueError('FK entity không tồn tại: ' + name + '.' + column['name'])
    for product in catalog:
        mapped = read(ROOT / 'products' / product['id'] / 'schema/entity-map.json')['entities']
        if any(name not in dictionary or definition != dictionary[name] for name,definition in mapped.items()):
            raise ValueError('Entity map không khớp dictionary: ' + product['id'])
    # Parse all JSON documents, including examples.
    count = 0
    for path in ROOT.rglob('*.json'):
        if any(x in path.parts for x in ['node_modules','.git']):
            continue
        read(path)
        count += 1
    return {'kit_check':'PASS','products':30,'tasks':len(tasks),'json_files_checked':count,
            'warning':'Chỉ kiểm tra kit; application gates vẫn cần thực thi.'}


def next_task():
    tasks, state = load()
    for task in tasks:
        if state['tasks'][task['id']]['phase'] in ACTIVE:
            return {'task':task,'state':state['tasks'][task['id']]}
    for task in tasks:
        if (state['tasks'][task['id']]['phase'] == 'pending'
                and all(state['tasks'][d]['phase'] == 'done' for d in task['depends_on'])):
            return {'task':task,'state':state['tasks'][task['id']]}
    blocked = [id for id, data in state['tasks'].items() if data['phase'] != 'done']
    return {'next':None,'remaining':blocked,'message':'Cần giải quyết blocker' if blocked else 'Mọi task done; chạy release-check'}


def checkpoint(id, phase, note, evidence=None):
    if not note.strip():
        raise ValueError('Note không được rỗng')
    with state_lock():
        tasks, state = load()
        task = next((t for t in tasks if t['id'] == id), None)
        if not task:
            raise ValueError('Task không tồn tại')
        current = state['tasks'][id]['phase']
        if phase not in TRANSITIONS[current]:
            raise ValueError(f'Không cho chuyển {current} -> {phase}')
        if phase in ACTIVE or phase == 'done':
            if any(state['tasks'][d]['phase'] != 'done' for d in task['depends_on']):
                raise ValueError('Phụ thuộc chưa done')
            if any(other != id and s['phase'] in ACTIVE for other,s in state['tasks'].items()):
                raise ValueError('Task khác đang active')
        if phase == 'done':
            if not evidence:
                raise ValueError('DONE cần evidence')
            validate_evidence(task, evidence)
        elif evidence:
            local_file(evidence, ROOT/'reports/evidence')
        state['tasks'][id] = {'phase':phase,'note':note,'evidence':evidence,
                              'updated_at':datetime.now().astimezone().isoformat()}
        save(state)
    return state['tasks'][id]


def reopen(id, note):
    if not note.strip():
        raise ValueError('Note không được rỗng')
    with state_lock():
        tasks, state = load()
        if id not in state['tasks']:
            raise ValueError('Task không tồn tại')
        affected = {id}
        while True:
            expanded = affected | {t['id'] for t in tasks if affected.intersection(t['depends_on'])}
            if expanded == affected:
                break
            affected = expanded
        for item in affected:
            state['tasks'][item] = {'phase':'pending','note':note,'evidence':None,
                                    'updated_at':datetime.now().astimezone().isoformat()}
        save(state)
    return {'reopened':sorted(affected)}


def release_check():
    check()
    tasks, state = load()
    failures = []
    for task in tasks:
        entry = state['tasks'][task['id']]
        if entry['phase'] != 'done':
            failures.append(task['id'] + ': ' + entry['phase'])
            continue
        try:
            validate_evidence(task, entry.get('evidence'))
        except (ValueError,KeyError,TypeError) as error:
            failures.append(task['id'] + ': ' + str(error))
    if failures:
        raise ValueError('RELEASE BLOCKED\n' + '\n'.join(failures))
    return {'manifest_check':'PASS','note':'Review revision và bằng chứng thực tế trước release; manifest không tự chứng minh sản phẩm đúng.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    for name in ['check','next','release-check']:
        commands.add_parser(name)
    cp = commands.add_parser('checkpoint')
    cp.add_argument('task')
    cp.add_argument('phase', choices=list(TRANSITIONS))
    cp.add_argument('--note', required=True)
    cp.add_argument('--evidence')
    rp = commands.add_parser('reopen')
    rp.add_argument('task')
    rp.add_argument('--note', required=True)
    args = parser.parse_args()
    try:
        if args.command == 'check': result = check()
        elif args.command == 'next': result = next_task()
        elif args.command == 'checkpoint': result = checkpoint(args.task,args.phase,args.note,args.evidence)
        elif args.command == 'reopen': result = reopen(args.task,args.note)
        else: result = release_check()
        print(json.dumps(result,ensure_ascii=False,indent=2))
        return 0
    except (ValueError,KeyError,TypeError,OSError) as error:
        print(str(error),file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
