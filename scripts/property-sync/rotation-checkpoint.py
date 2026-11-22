#!/usr/bin/env python3
"""Offline operator checkpoint. POSIX, Python 3.9+. No provider access or publishing."""
import argparse
from datetime import datetime, timedelta, timezone
import fcntl
import hashlib
import hmac
import json
import os
from pathlib import Path
import re
import secrets
import stat
import sys
import unicodedata

JST = timezone(timedelta(hours=9))
MEDIA = ("site", "atbb")
OPS = ("add", "update", "pause", "withdraw")
PRIOR = {"readback_required", "saved_refresh_pending", "saved_readback_required",
         "previously_saved", "already_reviewed", "confirmed_not_saved"}
SOURCES = ("owner", "origin", "official-secondary", "canonical-ad")
PUBLISH = {"same-episode", "admin-current", "available", "permission", "materials", "terms"}
STOP = {"applied", "ended", "permission-revoked", "expired-promotion", "conditions-conflict"}
EXISTING = {"admin-existing-active", "admin-existing-paused"}
RECONCILED = {"official-existing-active", "official-existing-paused", "official-existing-ended", "official-never-existed"}
PROOFS = PUBLISH | STOP | EXISTING | RECONCILED | {
    "receipt", "admin-exact-change", "public-exact-change", "public-stop-confirmed", "admin-first-listing",
    "official-final-not-applied", "official-final-outcome", "previous-send-uncertain", "resume-approved",
    "admin-published", "admin-draft", "admin-ended", "admin-stopped",
}
HOLDS = ("source-missing", "permission-unknown", "permission-denied", "terms-unknown", "identity-unknown",
         "materials-unknown", "capacity-unknown", "auth-needed", "readback-pending")
NOTES = ("accepted", "admin-matched", "public-on", "public-off", "not-applied", "prior-reconciled")
TERMINAL = {"public-on", "public-off", "not-applied", "prior-reconciled"}
ROW = re.compile(r"r-[0-9a-f]{32}\Z")
ATTEMPT = re.compile(r"a-[0-9a-f]{32}\Z")
SLUG = re.compile(r"rent-[0-9a-f]{24}\Z")
UUID = re.compile(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\Z")
HASH = re.compile(r"[0-9a-f]{64}\Z")
FIELDS = {"row", "medium", "op", "state", "at", "source", "proof", "reason", "reportId", "attempt"}
BIND_FIELDS = {"row", "idType", "tag", "claim", "at"}
REGISTRATION = {"site": "official-site-canonical", "atbb": "official-atbb-only-record"}
ALIAS_CLAIM = "same-official-episode"


class Hold(ValueError):
    pass


def need(ok, msg):
    if not ok:
        raise Hold(msg)


def instant(s):
    t = datetime.fromisoformat(s.replace("Z", "+00:00"))
    need(t.tzinfo is not None, "時刻にはタイムゾーンが必要です。")
    return t.astimezone(JST)


def keyed(namespace, value):
    return hmac.new(bytes.fromhex(namespace), value.encode(), hashlib.sha256).hexdigest()


def identity(ref, namespace):
    if SLUG.fullmatch(ref):
        kind, value = "site", ref
    elif UUID.fullmatch(ref.lower()):
        kind, value = "site-admin", ref.lower()
    elif ref.startswith("atbb-"):
        raw = ref[5:]
        digits = unicodedata.normalize("NFKC", raw)
        need(re.fullmatch(r"[0-9０-９]{1,20}", raw) and int(digits) > 0, "ATBBの正規の自社管理番号を指定してください。")
        kind, value = "atbb", str(int(digits))
    else:
        raise Hold("公式の管理IDを使い、氏名・住所・URL・認証情報は入力しないでください。")
    return kind, keyed(namespace, kind + ":" + value)


def ledger_id(ns):
    return hashlib.sha256(("rotation-ledger-v2:" + ns).encode()).hexdigest()[:24]


def binding(ns, fd):
    # Detect ordinary copies/replacement/account changes; not an external lease or tamper proof.
    st = os.fstat(fd)
    return keyed(ns, json.dumps([os.uname().nodename, os.getuid(), st.st_dev, st.st_ino]))


def operation_allowed(op, known):
    if known == "ended-stopped":
        return False  # Official management already confirmed the same withdrawal.
    if known == "ended":
        return op == "withdraw"  # Only a proven unapplied withdrawal may be attempted again.
    return op != "add" or known == "unknown"


def transition(old, e, known):
    need(isinstance(e, dict) and e.keys() == FIELDS, "記録形式が一致しません。")
    r, m, op, s, at, source, proof, reason = (e[k] for k in ("row", "medium", "op", "state", "at", "source", "proof", "reason"))
    need(ROW.fullmatch(r) and m in MEDIA and op in (*OPS, "unknown"), "形式外の対象です。")
    need(isinstance(proof, list) and all(p in PROOFS for p in proof) and len(proof) == len(set(proof)), "確認項目が不正です。")
    t, p = instant(at), set(proof)
    prev = old["state"] if old else None
    need(not old or instant(old["at"]) <= t, "時刻が過去に戻っています。既存の記録を確認してください。")
    need((s == "started" and source in SOURCES) or (s != "started" and source is None), "確認元を見直してください。")
    need((s == "held" and reason in HOLDS) or (s != "held" and reason is None), "保留理由を見直してください。")
    need(e["reportId"] is None or (s in ("queued", "prior-unknown") and m == "site" and
         HASH.fullmatch(e["reportId"])), "処理記録の識別値が不正です。")
    attempt = e["attempt"]
    if s in ("queued", "held"):
        need(attempt is None, "未送信行に試行IDは設定しません。")
    else:
        need(isinstance(attempt, str) and ATTEMPT.fullmatch(attempt), "試行IDが必要です。")
        if s not in ("started", "uncertain", "prior-unknown"):
            need(old and old["attempt"] == attempt, "対象試行が一致しません。以前の受付で今回を完了にしません。")

    if s == "prior-unknown":
        need(op == "unknown" and not p and (not old or prev in TERMINAL | {"queued", "held"}), "既存送信の読戻しが先です。")
        return
    if s == "prior-reconciled":
        need(op == "unknown" and prev == "prior-unknown" and len(p & RECONCILED) == 1 and
             p == {"same-episode", "official-final-outcome"} | (p & RECONCILED), "以前の操作結果と現在の正本の状態を確認してください。")
        return
    need(op in OPS, "以前の対象・操作と結果を正本で照合してください。")
    if s in ("queued", "started"):
        need(operation_allowed(op, known), "既存・停止済みの募集回を新規登録せず、終了確定・停止済みの記録に矛盾する操作はしません。")
    if s == "queued":
        need(not p and (not old or (prev in TERMINAL and (old["op"] != op or
             instant(old["at"]).date() != t.date() or prev == "not-applied")) or
             (prev in ("queued", "held") and old["op"] != op)), "先に既存行と読戻しを確認してください。")
        return
    need(old and old["op"] == op, "対象操作が変わっています。前の記録のまま操作しません。")
    if s == "held":
        need(prev in ("queued", "held") and not p, "送信後の行は保留に戻さず読戻ししてください。")
    elif s == "started":
        need(prev in ("queued", "held"), "送信開始記録あり。再送せず管理画面を読み戻してください。")
        if op in ("withdraw", "pause"):
            reasons = {"ended"} if op == "withdraw" else STOP - {"ended"}
            need(len(p & reasons) == 1 and p == {"same-episode", "admin-current"} | (p & reasons)
                 and (source != "canonical-ad" or bool(p & {"expired-promotion", "conditions-conflict"})),
                 "終了確証のないときは成約にせず、一時非公開の根拠を別に確認。時計・検索結果だけでは停止しません。")
        else:
            presumed_first = op == "add" and p == PUBLISH | {"admin-first-listing"}
            active = op == "update" and known != "paused" and p == PUBLISH | {"admin-existing-active"}
            paused = op == "update" and p == PUBLISH | {"admin-existing-paused", "resume-approved"}
            need(source != "canonical-ad" and (presumed_first or active or paused),
                 "この媒体の同一募集回・管理現況（新規/既存/停止）・募集・許諾・素材・条件を直前に照合してください。停止済みは正式な同一記録の再掲載確認が必要です。")
    else:
        admin = ("admin-published" if op in ("add", "update") else "admin-stopped" if m == "atbb"
                 else "admin-draft" if op == "pause" else "admin-ended")
        rule = {
            "uncertain": ({"queued", "held"}, {"previous-send-uncertain"}),
            "accepted": ({"started", "uncertain"}, {"receipt"}),
            "admin-matched": ({"started", "uncertain", "accepted"}, {"same-episode", "admin-exact-change", admin}),
            "public-on": ({"admin-matched"}, {"same-episode", "public-exact-change"}),
            "public-off": ({"admin-matched"}, {"same-episode", "public-stop-confirmed"}),
            "not-applied": ({"started", "uncertain", "accepted"}, {"same-episode", "official-final-not-applied"}),
        }.get(s)
        need(rule and prev in rule[0] and p == rule[1], "この試行・媒体・操作の前段の記録や読戻し根拠が足りません。")
        need((s != "public-off" or op in ("pause", "withdraw")) and (s != "public-on" or op in ("add", "update")), "予定した公開状態と一致しません。")


def next_known(known, e):
    # Retain existence/closure across holds, subsequent failed attempts, and day changes.
    state, operation, proof = e["state"], e["op"], e["proof"]
    if known == "ended-stopped" or (operation == "withdraw" and state == "admin-matched") or "official-existing-ended" in proof:
        return "ended-stopped"
    if known == "ended" or (operation == "withdraw" and state == "started"):
        return "ended"
    if state == "admin-matched":
        return "paused" if operation == "pause" else "active"
    if "admin-existing-paused" in proof or "official-existing-paused" in proof:
        return "paused"
    if known == "unknown" and ((state == "started" and operation in ("pause", "update")) or "official-existing-active" in proof):
        return "active"
    return known


class Checkpoint:
    def __init__(self, namespace, today):
        self.ns = namespace
        self.today = today
        self.aliases = {}
        self.types = {}
        self.rows = {}
        self.known = {}
        self.phases = {}
        self.seen_reports = set()
        self.today_events = set()

    def find(self, ref):
        if ROW.fullmatch(ref):
            return ref if ref in self.types else None
        return self.aliases.get(identity(ref, self.ns)[1])

    def add(self, e):
        if isinstance(e, dict) and e.keys() == BIND_FIELDS:
            row, kind, tag, claim = (e[k] for k in ("row", "idType", "tag", "claim"))
            need(ROW.fullmatch(row) and HASH.fullmatch(tag) and kind in (*MEDIA, "site-admin"), "公式IDの紐づけが不正です。")
            instant(e["at"])
            types = self.types.get(row, set())
            need(tag not in self.aliases and kind not in types, "既存のID・媒体の置換や重複登録はできません。正本で照合してください。")
            if row not in self.types:
                need(kind in REGISTRATION and claim == REGISTRATION[kind], "正本IDの明示確認が必要です。")
            else:
                need(claim == ALIAS_CLAIM and (kind != "site-admin" or "site" in types),
                     "同一募集回の公式確認と対応する四葉の正本slugが必要です。")
            self.aliases[tag] = row
            self.types[row] = types | {kind}
            return

        k = e["row"], e["medium"]
        need(e["medium"] in self.types.get(e["row"], set()), "対象媒体は公式管理IDとの照合・紐づけが先です。")
        known = self.known.get(k, "unknown")
        transition(self.rows.get(k), e, known)
        self.known[k] = next_known(known, e)
        if instant(e["at"]).date() == self.today:
            self.today_events.add((k[0], k[1], e["op"], e["state"]))
        if e["reportId"]:
            self.seen_reports.add((e["reportId"], k))
        if e["state"] in ("queued", "prior-unknown"):
            self.phases[k] = {}
        self.phases[k][e["state"]] = e["at"]
        if e["state"] == "started":
            self.phases[k]["evidence"] = {"source": e["source"], "proof": e["proof"]}
        self.rows[k] = e

    def report(self):
        def counts(m):
            channel = [e for e in self.rows.values() if e["medium"] == m]
            return {
                "startedToday": len({r for r, c, _, s in self.today_events if c == m and s == "started"}),
                "acceptedToday": len({r for r, c, _, s in self.today_events if c == m and s == "accepted"}),
                "adminMatchedToday": len({r for r, c, _, s in self.today_events if c == m and s == "admin-matched"}),
                "publicReadbackTodayByOp": {op: len({r for r, c, o, s in self.today_events if c == m and o == op and
                    s in ("public-on", "public-off")}) for op in OPS},
                "heldNow": sum(e["state"] == "held" for e in channel),
                "notStartedNow": sum(e["state"] == "queued" for e in channel),
                "readbackPendingNow": sum(e["state"] not in TERMINAL | {"held", "queued"} for e in channel),
            }

        def detail(k):
            latest = self.rows.get(k)
            return None if not latest else {
                "operation": latest["op"], "state": latest["state"], "attempt": latest["attempt"],
                "knownRecord": self.known[k], "holdReason": latest["reason"], "evidence": self.phases[k].get("evidence"),
                "timestamps": {p: v for p, v in self.phases[k].items() if p != "evidence"},
            }

        return {"scope": "tracked_rows_only_not_inventory", "externalOperations": 0, "jstDate": self.today.isoformat(),
                "coverage": "tracked_work_only" if self.rows else "no_work_rows_observed",
                "counts": {m: counts(m) for m in MEDIA},
                "rows": [{"row": row, "boundTypes": sorted(types), **{m: detail((row, m)) for m in MEDIA}}
                         for row, types in sorted(self.types.items())]}


def read_log(file, expected_id, today):
    file.seek(0)
    raw = file.read()
    need(raw.endswith("\n"), "記録が途中です。復旧確認までは操作しません。")
    lines = raw.splitlines()
    head = json.loads(lines[0])
    need(isinstance(head, dict) and head.keys() == {"version", "namespace", "binding"} and head["version"] == 2 and
         re.fullmatch(r"[0-9a-f]{32}", head["namespace"]), "既存記録の版が不明です。再初期化せず正本で照合してください。")
    need(expected_id == ledger_id(head["namespace"]) and head["binding"] == binding(head["namespace"], file.fileno()),
         "指定された作業帳簿/端末と一致しません。別帳簿を初期化せず、元の作業場所で再開してください。")
    check = Checkpoint(head["namespace"], today)
    for line in lines[1:]:
        batch = json.loads(line)
        need(isinstance(batch, list) and 1 <= len(batch) <= 50, "不正な記録単位です。")
        for e in batch:
            check.add(e)
    return check


def seed_plan(path, now):
    # Only sanitized check reports, not the source/monitoring export or actual send responses.
    need(path.is_file() and path.stat().st_size <= 64_000, "小さな社内用の登録前チェック結果JSONだけを指定してください。")
    data = json.loads(path.read_text(encoding="utf-8"))
    keys = {"version", "medium", "publicReadback", "startedAt", "mode", "operation", "stage", "rows"}
    need(isinstance(data, dict) and data.keys() == keys and data["version"] == 1 and data["medium"] == "yotsuba" and
         data["stage"] == "check" and data["publicReadback"] == "not_verified" and data["operation"] in ("new", "maintenance", "close") and
         data["mode"] in ("draft", "published") and (data["mode"] == "published" or data["operation"] == "close"),
         "四葉の公開対象の登録前チェックのみ取込可。反映結果・下書き・監視対象JSONは読み込みません。")
    then = instant(data["startedAt"])
    need(then <= now and then.date() == now.date(), "当日（日本時間）のチェック結果を使用してください。")
    rows = data["rows"]
    need(isinstance(rows, list) and 1 <= len(rows) <= 50, "行数が不正です。")
    found, slugs = [], set()
    for i, v in enumerate(rows, 1):
        need(isinstance(v, dict) and v.keys() == {"row", "slug", "action"} and v["row"] == i and
             (v["slug"] is None or SLUG.fullmatch(v["slug"])), "チェック結果の行形式が不正です。")
        slug, action = v["slug"], v["action"]
        if slug:
            need(slug not in slugs, "同一住戸の行が重複しています。再確認してください。")
            slugs.add(slug)
        need(action in PRIOR | {"ready", "ready-close", "held", "not_observed", "unchanged"}, "未対応の結果です。正本の行を確認してください。")
        if action in PRIOR:
            need(slug, "読戻しが必要な行に正本slugがありません。未完了です。正本から同一募集回を特定してください。")
            found.append((slug, "unknown"))
        elif action in ("ready", "ready-close"):
            need(slug, "チェック対象が不明です。")
            op = "withdraw" if action == "ready-close" or data["operation"] == "close" else (
                "add" if data["operation"] == "new" else "update")
            found.append((slug, op))
    report_id = hashlib.sha256(json.dumps(data, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    return found, len(rows) - len(found), report_id


def cli(args, now=None):
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--ledger", type=Path, required=True, help="指定の単一ホスト内の専用ファイル（明示必須）")
    ap.add_argument("--ledger-id", default=os.environ.get("YOTSUBA_ROTATION_LEDGER_ID"), help="初回に控えた帳簿ID。資格情報ではありません。")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init")
    sub.add_parser("report")
    sub.add_parser("seed-check").add_argument("report", type=Path)
    for cmd in ("register", "bind", "queue", "hold", "start", "recover", "note"):
        p = sub.add_parser(cmd)
        p.add_argument("ref")
        if cmd == "register":
            p.add_argument("claim", choices=REGISTRATION.values())
        elif cmd == "bind":
            p.add_argument("alias")
            p.add_argument("claim", choices=(ALIAS_CLAIM,))
        else:
            p.add_argument("medium", choices=MEDIA)
            if cmd in ("queue", "start", "recover"):
                p.add_argument("op", choices=OPS)
            if cmd == "hold":
                p.add_argument("reason", choices=HOLDS)
            elif cmd == "start":
                p.add_argument("source", choices=SOURCES)
            elif cmd == "note":
                p.add_argument("attempt")
                p.add_argument("state", choices=NOTES)
            if cmd in ("start", "note"):
                p.add_argument("proof", nargs="+", choices=sorted(PROOFS))
    a = ap.parse_args(args)
    path = a.ledger.expanduser()
    if a.cmd == "init":
        need(not a.ledger_id, "記録済みIDがあるため新規初期化しません。既存の帳簿を確認してください。")
        need(path.parent.is_dir(), "許可された非共有の作業フォルダを先に選んでください。")
        fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY | os.O_NOFOLLOW, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            ns = secrets.token_hex(16)
            f.write(json.dumps({"version": 2, "namespace": ns, "binding": binding(ns, fd)}) + "\n")
            f.flush()
            os.fsync(f.fileno())
        return {"initialized": True, "ledgerId": ledger_id(ns), "externalOperations": 0}

    need(a.ledger_id and re.fullmatch(r"[0-9a-f]{24}", a.ledger_id), "開始時に控えた帳簿IDを指定してください。")
    readonly = a.cmd == "report"
    fd = os.open(path, (os.O_RDONLY if readonly else os.O_RDWR | os.O_APPEND) | os.O_NOFOLLOW)
    with os.fdopen(fd, "r" if readonly else "r+", encoding="utf-8") as file:
        st = os.fstat(fd)
        need(stat.S_ISREG(st.st_mode) and st.st_uid == os.getuid() and st.st_mode & 0o077 == 0, "自分専用の非公開な記録ファイルを使用してください。")
        fcntl.flock(fd, fcntl.LOCK_SH if readonly else fcntl.LOCK_EX)
        now = (now if now is not None else datetime.now(JST)).astimezone(JST)
        timestamp = now.isoformat(timespec="seconds")
        check = read_log(file, a.ledger_id, now.date())
        if readonly:
            return check.report()
        batch = []

        def append(e):
            check.add(e)
            batch.append(e)

        def work(row, medium, op, state, source=None, proof=(), reason=None, report_id=None, attempt=None):
            append(dict(row=row, medium=medium, op=op, state=state, at=timestamp, source=source,
                        proof=sorted(proof), reason=reason, reportId=report_id, attempt=attempt))

        skipped = unbound = 0
        if a.cmd in ("register", "bind"):
            kind, tag = identity(a.ref if a.cmd == "register" else a.alias, check.ns)
            row = "r-" + secrets.token_hex(16) if a.cmd == "register" else check.find(a.ref)
            need(row, "紐づけ先が未登録です。")
            append(dict(row=row, idType=kind, tag=tag, claim=a.claim, at=timestamp))
            # Report the anonymous row, not the tag or ID.
            result = {"row": row, "boundType": kind, "externalOperations": 0}
        elif a.cmd == "seed-check":
            planned, skipped, sig = seed_plan(a.report, now)
            for ref, op in planned:
                row = check.find(ref)
                if not row:
                    need(op != "unknown", "読戻しが必要な行は正本IDを登録してから再取込してください。未完了です。")
                    unbound += 1
                    skipped += 1
                    continue
                k = row, "site"
                old = check.rows.get(k)
                if (sig, k) in check.seen_reports:
                    skipped += 1
                    continue
                if op == "unknown":
                    if old and old["state"] not in TERMINAL | {"queued", "held"}:
                        skipped += 1
                    else:
                        work(row, "site", op, "prior-unknown", report_id=sig, attempt="a-" + secrets.token_hex(16))
                    continue
                if not operation_allowed(op, check.known.get(k, "unknown")) or (old and (
                        old["state"] not in TERMINAL or instant(old["at"]).date() == now.date())):
                    skipped += 1
                    continue
                work(row, "site", op, "queued", report_id=sig)
            result = {"recorded": batch, "skipped": skipped, "unbound": unbound,
                      "coverage": "incomplete_unbound" if unbound else "check_rows_only_not_inventory", "externalOperations": 0}
        else:
            row = check.find(a.ref)
            need(row and a.medium in check.types[row], "この媒体の公式管理IDを先に照合して紐づけてください。")
            old = check.rows.get((row, a.medium))
            if a.cmd == "queue":
                work(row, a.medium, a.op, "queued")
            else:
                need(old, "未登録の媒体行です。queue で作業予定を先に記録してください。")
                if a.cmd == "hold":
                    work(row, a.medium, old["op"], "held", reason=a.reason)
                elif a.cmd == "start":
                    work(row, a.medium, a.op, "started", a.source, a.proof, attempt="a-" + secrets.token_hex(16))
                elif a.cmd == "recover":
                    work(row, a.medium, a.op, "uncertain", proof=("previous-send-uncertain",), attempt="a-" + secrets.token_hex(16))
                else:
                    work(row, a.medium, old["op"], a.state, proof=a.proof, attempt=a.attempt)
            result = {"recorded": batch, "externalOperations": 0}
        if batch:
            file.seek(0, 2)
            file.write(json.dumps(batch, separators=(",", ":")) + "\n")
            file.flush()
            os.fsync(fd)
        return result


if __name__ == "__main__":
    try:
        print(json.dumps(cli(sys.argv[1:]), ensure_ascii=False, indent=2))
    except Hold as e:
        sys.exit("保留: " + str(e))
    except (OSError, KeyError, IndexError, TypeError, ValueError, AttributeError):
        sys.exit("保留: 入力・既存記録を読み書きできません。再送・再初期化せず記録を確認してください。")
