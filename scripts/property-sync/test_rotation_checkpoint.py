from datetime import datetime, timedelta, timezone
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name("rotation-checkpoint.py")
sp = importlib.util.spec_from_file_location("checkpoint", SCRIPT)
cp = importlib.util.module_from_spec(sp)
sp.loader.exec_module(cp)
JST = timezone(timedelta(hours=9))
T = datetime(2030, 1, 7, 23, 59, tzinfo=JST)
REF = "rent-" + "a"*24
OTHER = "rent-" + "c"*24
ADMIN = "00000000-0000-4000-8000-000000000001"
ATBB = "atbb-12"
UPDATE = sorted(cp.PUBLISH | {"admin-existing-active"})
FIRST = sorted(cp.PUBLISH | {"admin-first-listing"})
RESUME = sorted(cp.PUBLISH | {"admin-existing-paused", "resume-approved"})


class Case(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.store = Path(self.tmp.name) / "state"
        self.ledger_id = self.call("init")["ledgerId"]
        self.row = self.site_register(REF)

    def call(self, *args, at=T):
        opts = ["--ledger-id", self.ledger_id] if hasattr(self, "ledger_id") else []
        return cp.cli(["--ledger", str(self.store), *opts, *args], at)

    def site_register(self, ref):
        return self.call("register", ref, "official-site-canonical")["row"]

    def site(self, *args, at=T):
        return self.call(args[0], REF, "site", *args[1:], at=at)

    def attempt(self, res):
        return res["recorded"][0]["attempt"]

    def status(self, row=None):
        return next(r for r in self.call("report")["rows"] if r["row"] == (row or self.row))

    def report_in(self, actions, **overrides):
        out = {"version": 1, "medium": "yotsuba", "publicReadback": "not_verified",
               "startedAt": (T-timedelta(seconds=5)).isoformat(), "mode": "published", "operation": "maintenance", "stage": "check",
               "rows": [{"row": i, "slug": slug, "action": a} for i, (slug, a) in enumerate(actions, 1)]}
        out.update(overrides)
        f = Path(self.tmp.name)/"check.json"
        f.write_text(json.dumps(out))
        return str(f)

    def test_alias_normalization_binding_and_no_reassignment(self):
        with self.assertRaises(cp.Hold):
            self.call("register", ADMIN, "official-site-canonical")
        with self.assertRaises(cp.Hold):
            self.call("queue", ADMIN, "site", "update")
        with self.assertRaises(cp.Hold):
            self.call("queue", REF, "atbb", "update")
        self.call("bind", self.row, ADMIN.upper(), "same-official-episode")
        self.call("bind", ADMIN, "atbb-０００１２", "same-official-episode")
        self.call("queue", "atbb-00012", "atbb", "update")
        a = self.attempt(self.call("start", ATBB, "atbb", "update", "origin", *UPDATE))
        with self.assertRaises(cp.Hold):
            self.call("start", "atbb-00012", "atbb", "update", "origin", *UPDATE)
        with self.assertRaises(cp.Hold):
            self.call("register", ATBB, "official-atbb-only-record")
        self.site_register(OTHER)
        with self.assertRaises(cp.Hold):
            self.call("bind", OTHER, ATBB, "same-official-episode")
        with self.assertRaises(cp.Hold):
            self.call("bind", REF, "atbb-99", "same-official-episode")
        self.call("queue", ADMIN, "site", "update")
        self.site("start", "update", "owner", *UPDATE)
        with self.assertRaises(cp.Hold):
            self.call("start", ADMIN, "site", "update", "origin", *UPDATE)
        self.assertEqual(self.status()["atbb"]["attempt"], a)
        self.assertEqual(self.status()["boundTypes"], ["atbb","site","site-admin"])
        for real in (REF, ADMIN, ATBB, "atbb-00012", OTHER):
            self.assertNotIn(real, self.store.read_text())

    def test_standalone_atbb_can_bind_site_if_not_already_registered(self):
        r = self.call("register", "atbb-00013", "official-atbb-only-record")["row"]
        self.call("bind", r, OTHER, "same-official-episode")
        with self.assertRaises(cp.Hold): self.site_register(OTHER)
        self.call("seed-check", self.report_in([(OTHER,"ready")]))
        self.assertEqual(self.status(r)["site"]["operation"], "update")
        self.assertIsNone(self.status(r)["atbb"])
        with self.assertRaises(cp.Hold): self.call("bind", r, REF, "same-official-episode")

    def test_start_unknown_next_day_still_blocked_other_medium_independent(self):
        self.site("queue", "update")
        self.site("start", "update", "origin", *UPDATE)
        tomorrow = T+timedelta(minutes=3)
        for op in cp.OPS:
            with self.assertRaises(cp.Hold):
                self.site("queue", op, at=tomorrow)
        with self.assertRaises(cp.Hold):
            self.site("start", "update", "origin", *UPDATE, at=tomorrow)
        self.call("bind", self.row, ATBB, "same-official-episode", at=tomorrow)
        self.call("queue", REF, "atbb", "update", at=tomorrow)
        self.call("hold", REF, "atbb", "permission-unknown", at=tomorrow)
        row = next(r for r in self.call("report", at=tomorrow)["rows"] if r["row"] == self.row)
        self.assertEqual(row["site"]["state"], "started")
        self.assertEqual(row["atbb"]["state"], "held")
        self.assertNotIn("public-on", row["site"]["timestamps"])

    def test_checked_not_sufficient_or_public_without_admin(self):
        self.site("queue","update")
        for excluded in UPDATE:
            with self.subTest(excluded=excluded), self.assertRaises(cp.Hold):
                self.site("start","update","origin",*(set(UPDATE)-{excluded}))
        a = self.attempt(self.site("start","update","owner",*UPDATE))
        self.site("note",a,"accepted","receipt")
        with self.assertRaises(cp.Hold):
            self.site("note",a,"public-on","same-episode","public-exact-change")
        self.site("note",a,"admin-matched","same-episode","admin-exact-change","admin-published")
        with self.assertRaises(cp.Hold):
            self.site("note",a,"public-off","same-episode","public-stop-confirmed")
        self.site("note",a,"public-on","same-episode","public-exact-change")
        report = self.call("report")
        self.assertEqual(report["counts"]["site"]["publicReadbackTodayByOp"]["update"],1)
        self.assertEqual(report["counts"]["atbb"]["publicReadbackTodayByOp"]["update"],0)
        self.assertEqual(self.call("report",at=T+timedelta(days=1))["counts"]["site"]["publicReadbackTodayByOp"]["update"],0)
        self.assertEqual(set(self.status()["site"]["timestamps"]), {"queued","started","accepted","admin-matched","public-on"})
        self.assertIsNone(self.status()["atbb"])

    def test_sticky_existence_through_hold_and_seed(self):
        self.site("queue","add")
        a = self.attempt(self.site("start","add","origin",*FIRST))
        self.site("note",a,"admin-matched","same-episode","admin-exact-change","admin-published")
        self.site("note",a,"public-on","same-episode","public-exact-change")
        tomorrow = T+timedelta(days=1)
        self.site("queue","update",at=tomorrow)
        self.site("hold","permission-unknown",at=tomorrow)
        with self.assertRaises(cp.Hold): self.site("queue","add",at=tomorrow)
        with self.assertRaises(cp.Hold): self.site("start","add","origin",*FIRST,at=tomorrow)
        f = self.report_in([(REF,"ready")], operation="new", startedAt=(tomorrow-timedelta(seconds=5)).isoformat())
        self.assertEqual(self.call("seed-check",f,at=tomorrow)["recorded"],[])
        self.assertEqual(self.status()["site"]["knownRecord"],"active")

    def test_partial_failure_does_not_accept_delayed_receipt_or_changed_op(self):
        self.site("queue","add")
        self.site("queue","update")
        with self.assertRaises(cp.Hold): self.site("start","add","origin",*FIRST)
        self.site("queue","add")
        a1 = self.attempt(self.site("recover","add"))
        with self.assertRaises(cp.Hold): self.site("hold","readback-pending")
        with self.assertRaises(cp.Hold): self.site("note",a1,"not-applied","same-episode")
        self.site("note",a1,"not-applied","same-episode","official-final-not-applied")
        self.site("queue","add")
        a2 = self.attempt(self.site("start","add","origin",*FIRST))
        self.assertNotEqual(a1,a2)
        with self.assertRaises(cp.Hold): self.site("note",a1,"accepted","receipt")
        with self.assertRaises(cp.Hold): self.site("note",a1,"admin-matched","same-episode","admin-exact-change","admin-published")
        self.site("note",a2,"accepted","receipt")

    def test_pause_is_not_contracted_and_only_verified_same_record_can_resume(self):
        self.site("queue","pause")
        with self.assertRaises(cp.Hold): self.site("start","pause","origin",*UPDATE)
        a = self.attempt(self.site("start","pause","canonical-ad","same-episode","admin-current","expired-promotion"))
        with self.assertRaises(cp.Hold): self.site("note",a,"admin-matched","same-episode","admin-exact-change","admin-ended")
        self.site("note",a,"admin-matched","same-episode","admin-exact-change","admin-draft")
        with self.assertRaises(cp.Hold): self.site("note",a,"public-on","same-episode","public-exact-change")
        self.site("note",a,"public-off","same-episode","public-stop-confirmed")
        self.assertEqual(self.status()["site"]["knownRecord"],"paused")
        self.site("queue","update")
        with self.assertRaises(cp.Hold): self.site("start","update","origin",*UPDATE)
        with self.assertRaises(cp.Hold): self.site("start","update","origin",*(set(RESUME)-{"resume-approved"}))
        a = self.attempt(self.site("start","update","origin",*RESUME))
        self.site("note",a,"admin-matched","same-episode","admin-exact-change","admin-published")
        self.assertEqual(self.status()["site"]["knownRecord"],"active")

    def test_existing_site_close_report_ready_maps_withdraw_and_requires_end_evidence(self):
        f = self.report_in([(REF,"ready")], mode="draft", operation="close")
        res=self.call("seed-check",f)
        self.assertEqual([(r["op"],r["state"],r["proof"]) for r in res["recorded"]],[("withdraw","queued",[])])
        with self.assertRaises(cp.Hold): self.site("start","withdraw","origin","same-episode","admin-current","applied")
        a = self.attempt(self.site("start","withdraw","origin","same-episode","admin-current","ended"))
        self.site("note",a,"not-applied","same-episode","official-final-not-applied")
        for op in ("update","add","pause"):
            with self.assertRaises(cp.Hold): self.site("queue",op)
        self.assertEqual(self.status()["site"]["knownRecord"],"ended")
        self.site("queue","withdraw")  # Provider verifiably did not apply the stop; do not reopen.
        a=self.attempt(self.site("start","withdraw","origin","same-episode","admin-current","ended"))
        self.site("note",a,"admin-matched","same-episode","admin-exact-change","admin-ended")
        self.site("note",a,"public-off","same-episode","public-stop-confirmed")
        for op in cp.OPS:
            with self.assertRaises(cp.Hold): self.site("queue",op,at=T+timedelta(days=1))
        self.assertEqual(self.status()["site"]["knownRecord"],"ended-stopped")

    def test_seed_is_triage_not_evidence_and_never_overwrites_unresolved(self):
        self.site_register(OTHER)
        f = self.report_in([(REF,"ready"), (OTHER,"ready-close"), (None,"held")])
        once = self.call("seed-check",f)
        self.assertEqual([v["op"] for v in once["recorded"]],["update","withdraw"])
        self.assertEqual(once["skipped"],1)
        self.assertTrue(all(v["state"]=="queued" and not v["proof"] for v in once["recorded"]))
        self.site("start","update","origin",*UPDATE)
        self.assertEqual(self.call("seed-check",f)["skipped"],3)
        self.assertTrue(all(v["atbb"] is None for v in self.call("report")["rows"]))

    def test_unknown_readback_key_fails_and_unbound_ready_is_explicit(self):
        for ref in (None,OTHER):
            with self.assertRaises(cp.Hold):
                self.call("seed-check",self.report_in([(REF,"ready"),(ref,"readback_required")]))
        r = self.call("seed-check",self.report_in([(OTHER,"ready")]))
        self.assertEqual(r["coverage"],"incomplete_unbound")
        self.assertEqual(r["unbound"],1)
        self.assertEqual(self.call("report")["coverage"],"no_work_rows_observed")

    def test_seed_rejects_stale_write_result_and_duplicate_atomically(self):
        for fields in ({"stage":"apply"},{"mode":"draft"},{"startedAt":(T+timedelta(seconds=10)).isoformat()},
                       {"startedAt":(T-timedelta(days=1)).isoformat()},{"token":"NO-STORE"},{"operation":"other"}):
            with self.assertRaises(cp.Hold):
                self.call("seed-check",self.report_in([(REF,"ready")],**fields))
        with self.assertRaises(cp.Hold):
            self.call("seed-check",self.report_in([(REF,"ready"),(REF,"held")]))
        self.assertEqual(self.call("report")["coverage"],"no_work_rows_observed")

    def test_site_old_receipt_blocks_and_cannot_certify_public(self):
        refs = ["rent-"+format(i+10, "024x") for i in range(len(cp.PRIOR))]
        for ref in refs:
            self.site_register(ref)
        f = self.report_in(list(zip(refs, sorted(cp.PRIOR))))
        res = self.call("seed-check",f)
        self.assertTrue(all(e["state"]=="prior-unknown" for e in res["recorded"]))
        for ref,row in zip(refs,res["recorded"]):
            a = row["attempt"]
            with self.assertRaises(cp.Hold): self.call("queue",ref,"site","update",at=T+timedelta(days=1))
            with self.assertRaises(cp.Hold): self.call("note",ref,"site",a,"admin-matched","same-episode","admin-exact-change","admin-published")
            self.call("note",ref,"site",a,"prior-reconciled","same-episode","official-final-outcome","official-existing-active")
            self.call("queue",ref,"site","update")
            with self.assertRaises(cp.Hold): self.call("queue",ref,"site","add")
        self.assertEqual(self.call("seed-check",f)["recorded"],[])
        self.assertTrue(all("public-on" not in r["site"]["timestamps"] for r in self.call("report")["rows"] if r["site"]))

    def test_missing_corrupt_or_private_ledger(self):
        with self.assertRaises(cp.Hold): self.call("init")
        with self.assertRaises(FileExistsError): cp.cli(["--ledger",str(self.store),"init"])
        with self.assertRaises(cp.Hold): self.call("queue","user@example.invalid","atbb","update")
        self.store.chmod(0o640)
        with self.assertRaises(cp.Hold): self.call("report")
        self.store.chmod(0o600)
        with self.store.open("a") as f: f.write("[")
        with self.assertRaises(cp.Hold): self.site("queue","update")
        self.store.unlink()
        with self.assertRaises(FileNotFoundError): self.site("queue","update")

    def test_copied_or_new_ledger_blocked(self):
        other = Path(self.tmp.name)/"other"
        shutil.copy2(self.store, other)
        with self.assertRaises(cp.Hold):
            cp.cli(["--ledger",str(other),"--ledger-id",self.ledger_id,"report"])
        other.unlink()
        new_id = cp.cli(["--ledger",str(other),"init"])["ledgerId"]
        self.assertNotEqual(new_id,self.ledger_id)
        with self.assertRaises(cp.Hold):
            cp.cli(["--ledger",str(other),"--ledger-id",self.ledger_id,"report"])
        with self.assertRaises(cp.Hold):
            cp.cli(["--ledger",str(other),"report"])

    def test_atbb_separate_definitive_stop(self):
        self.call("bind",REF,ATBB,"same-official-episode")
        self.call("queue",ATBB,"atbb","withdraw")
        a = self.attempt(self.call("start",ATBB,"atbb","withdraw","origin","same-episode","admin-current","ended"))
        with self.assertRaises(cp.Hold):
            self.call("note",ATBB,"atbb",a,"admin-matched","same-episode","admin-exact-change","admin-ended")
        self.call("note",ATBB,"atbb",a,"admin-matched","same-episode","admin-exact-change","admin-stopped")
        self.call("note",ATBB,"atbb",a,"public-off","same-episode","public-stop-confirmed")
        self.assertEqual(self.status()["atbb"]["knownRecord"],"ended-stopped")
        self.assertIsNone(self.status()["site"])

    def test_clock_is_sampled_after_lock_and_midnight_refuses_old_report(self):
        f = self.report_in([(REF,"ready")])
        locked = False
        real_flock = cp.fcntl.flock

        def lock(*args):
            nonlocal locked
            real_flock(*args)
            locked = True

        with patch.object(cp.fcntl,"flock",side_effect=lock), patch.object(cp,"datetime",wraps=datetime) as dt:
            dt.now.side_effect=lambda _zone: (T+timedelta(minutes=2)) if locked else T
            with self.assertRaises(cp.Hold):
                self.call("seed-check",f,at=None)
            dt.now.assert_called_once_with(JST)
        self.assertEqual(self.call("report")["coverage"],"no_work_rows_observed")

    def test_concurrent_start_max_one_success(self):
        self.site("queue","add",at=datetime(2020,1,2,tzinfo=JST))
        cmd = [sys.executable,str(SCRIPT),"--ledger",str(self.store),"--ledger-id",self.ledger_id,"start",REF,"site","add","origin",*FIRST]
        workers=[subprocess.Popen(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True) for _ in range(4)]
        for w in workers:
            w.communicate(timeout=10)
        self.assertEqual(sorted(w.returncode for w in workers),[0,1,1,1])
        self.assertEqual(self.call("report")["rows"][0]["site"]["state"], "started")


if __name__ == "__main__":
    unittest.main()
