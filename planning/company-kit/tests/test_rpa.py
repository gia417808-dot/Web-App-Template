"""Tests helper guardrails only. Application/business gates remain NOT_RUN."""
import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('rpa',Path(__file__).resolve().parents[1]/'scripts/rpa.py')
rpa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rpa)


class TaskGuards(unittest.TestCase):
    def setUp(self):
        self.original = rpa.ROOT
        self.temp = tempfile.TemporaryDirectory()
        rpa.ROOT = Path(self.temp.name)
        (rpa.ROOT/'work').mkdir()
        self.tasks = [
            {'id':'A','depends_on':[],'required_gates':['REVIEW']},
            {'id':'B','depends_on':['A'],'required_gates':['TEST']},
            {'id':'C','depends_on':[],'required_gates':['TEST']},
        ]
        self.write('work/tasks.json',{'tasks':self.tasks})
        self.write('work/state.json',{'tasks':{t['id']:{'phase':'pending','note':'','evidence':None} for t in self.tasks}})

    def tearDown(self):
        rpa.ROOT = self.original
        self.temp.cleanup()

    def write(self,name,value):
        path=rpa.ROOT/name
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(json.dumps(value),encoding='utf-8')

    def evidence(self):
        path=rpa.ROOT/'reports/evidence/A/log.txt'
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text('Synthetic helper test only; not app evidence.',encoding='utf-8')
        item={'task_id':'A','source_revision':'synthetic-test-revision','timestamp':'2026-09-29T10:00:00+07:00',
              'environment':'isolated temp test','reviewer':'unit-test','gates':[{
                  'id':'REVIEW','status':'PASS','expected':'fixture accepted','actual':'fixture accepted',
                  'command':'test fixture','exit_code':0,'files':[{'path':'reports/evidence/A/log.txt',
                    'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}]}]}
        self.write('reports/evidence/A/manifest.json',item)
        return 'reports/evidence/A/manifest.json'

    def advance(self):
        for phase in ['review','plan','act','verify']:
            rpa.checkpoint('A',phase,'test')

    def test_next_is_dependency_ready(self):
        self.assertEqual(rpa.next_task()['task']['id'],'A')

    def test_dependency_blocks_start(self):
        with self.assertRaisesRegex(ValueError,'Phụ thuộc'):
            rpa.checkpoint('B','review','test')

    def test_cannot_skip_review_plan_act(self):
        with self.assertRaises(ValueError):rpa.checkpoint('A','done','test')

    def test_only_one_active_task(self):
        rpa.checkpoint('A','review','test')
        with self.assertRaisesRegex(ValueError,'active'):rpa.checkpoint('C','review','test')

    def test_done_requires_evidence(self):
        self.advance()
        with self.assertRaisesRegex(ValueError,'evidence'):rpa.checkpoint('A','done','test')

    def test_done_with_valid_manifest(self):
        self.advance()
        rpa.checkpoint('A','done','test',self.evidence())
        self.assertEqual(rpa.next_task()['task']['id'],'B')

    def test_changed_evidence_rejected(self):
        path=self.evidence()
        (rpa.ROOT/'reports/evidence/A/log.txt').write_text('changed')
        with self.assertRaisesRegex(ValueError,'Hash'):rpa.validate_evidence(self.tasks[0],path)

    def test_not_run_cannot_pass(self):
        path=self.evidence();data=rpa.read(rpa.ROOT/path)
        data['gates'][0]['status']='NOT_RUN';self.write(path,data)
        with self.assertRaisesRegex(ValueError,'PASS'):rpa.validate_evidence(self.tasks[0],path)

    def test_evidence_path_escape_rejected(self):
        path=self.evidence();data=rpa.read(rpa.ROOT/path)
        data['gates'][0]['files'][0]['path']='../../outside.txt';self.write(path,data)
        with self.assertRaises(ValueError):rpa.validate_evidence(self.tasks[0],path)

    def test_lock_does_not_overwrite_state(self):
        before=(rpa.ROOT/'work/state.json').read_bytes()
        (rpa.ROOT/'work/.state.lock').write_text('123')
        with self.assertRaisesRegex(ValueError,'khóa'):rpa.checkpoint('A','review','test')
        self.assertEqual(before,(rpa.ROOT/'work/state.json').read_bytes())

    def test_reopen_invalidates_dependents(self):
        self.advance();rpa.checkpoint('A','done','test',self.evidence())
        rpa.checkpoint('B','review','test')
        result=rpa.reopen('A','changed code')
        self.assertEqual(result['reopened'],['A','B'])
        self.assertEqual(rpa.load()[1]['tasks']['B']['phase'],'pending')

    def test_graph_cycle_rejected(self):
        self.tasks[0]['depends_on']=['B']
        with self.assertRaisesRegex(ValueError,'cycle'):rpa.graph_check(self.tasks)

    def test_failed_done_does_not_mutate_state(self):
        self.advance();before=(rpa.ROOT/'work/state.json').read_bytes()
        with self.assertRaises(ValueError):rpa.checkpoint('A','done','test','missing.json')
        self.assertEqual(before,(rpa.ROOT/'work/state.json').read_bytes())


if __name__=='__main__':unittest.main()
