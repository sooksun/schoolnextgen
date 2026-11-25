"""Validate a software factory work order and run repository checks."""

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


WORK_ORDERS = Path("harness/work-orders")


def load_object(path):
    try:
        value = json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, ValueError) as error:
        raise ValueError(f"{path}: {error}") from error
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected a JSON object")
    return value


def require_text(data, key, section):
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{section}.{key}: expected non-empty text")
    return value


def validate_checks(checks):
    if not checks:
        raise ValueError("checks: configure at least one project check")
    for name, argv in checks.items():
        if (
            not name.strip()
            or not isinstance(argv, list)
            or not argv
            or not all(isinstance(arg, str) and "\0" not in arg for arg in argv)
            or not argv[0].strip()
        ):
            raise ValueError(f"checks.{name}: expected an executable and arguments as a JSON array")


def validate_order(order, checks):
    for key in ("id", "source", "owner", "outcome"):
        require_text(order, key, "work_order")

    risk = order.get("risk")
    if risk not in ("low", "standard", "high"):
        raise ValueError("work_order.risk: expected low, standard, or high")
    if risk in ("standard", "high"):
        require_text(order, "plan", "work_order")
    if risk == "high":
        require_text(order, "rollback", "work_order")

    criteria = order.get("acceptance")
    if not isinstance(criteria, list) or not criteria:
        raise ValueError("work_order.acceptance: expected at least one criterion")
    for index, criterion in enumerate(criteria):
        section = f"work_order.acceptance[{index}]"
        if not isinstance(criterion, dict):
            raise ValueError(f"{section}: expected an object")
        require_text(criterion, "outcome", section)
        check = require_text(criterion, "check", section)
        if check not in checks:
            raise ValueError(f"{section}.check: unknown check {check!r}")

    if "experiment" in order:
        experiment = order["experiment"]
        if not isinstance(experiment, dict):
            raise ValueError("work_order.experiment: expected an object")
        for key in ("hypothesis", "metric", "flag"):
            require_text(experiment, key, "work_order.experiment")
        if experiment.get("default_off") is not True:
            raise ValueError("work_order.experiment.default_off: must be true")


def changed_orders(base):
    try:
        revision = subprocess.run(
            ["git", "rev-parse", "--verify", "--end-of-options", f"{base}^{{commit}}"],
            check=True, capture_output=True,
        ).stdout.decode("ascii").strip()
        diff = subprocess.run(
            ["git", "diff", "--no-renames", "--name-only", "-z", "--diff-filter=AM",
             f"{revision}...HEAD", "--", WORK_ORDERS.as_posix()],
            check=True, capture_output=True,
        ).stdout
    except subprocess.CalledProcessError as error:
        detail = error.stderr.decode(errors="replace").strip()
        raise ValueError(f"cannot find work orders relative to {base!r}: {detail}") from error
    except OSError as error:
        raise ValueError(f"cannot run Git to find changed work orders: {error}") from error

    paths = [Path(os.fsdecode(name)) for name in diff.split(b"\0") if name]
    orders = [path for path in paths if path.parent == WORK_ORDERS and path.suffix == ".json"]
    if not orders:
        raise ValueError(f"add or update a JSON work order in {WORK_ORDERS.as_posix()}/")
    return orders


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("phase", choices=("intake", "verify"))
    parser.add_argument("work_order", type=Path, nargs="?")
    parser.add_argument("--checks", type=Path, default=Path("harness/checks.json"))
    parser.add_argument("--since", metavar="GIT_BASE", help="verify work orders added or changed since the merge base")
    args = parser.parse_args()
    if args.since is not None and (args.phase != "verify" or args.work_order is not None):
        parser.error("--since is only available with verify and replaces the work order path")
    if args.since is None and args.work_order is None:
        parser.error("provide a work order path or use verify --since GIT_BASE")

    try:
        paths = [args.work_order] if args.since is None else changed_orders(args.since)
        checks = load_object(args.checks)
        validate_checks(checks)
        ids = []
        for path in paths:
            order = load_object(path)
            try:
                validate_order(order, checks)
            except ValueError as error:
                raise ValueError(f"{path}: {error}") from error
            ids.append(order["id"])
    except ValueError as error:
        print(f"INVALID {error}", file=sys.stderr)
        return 2

    for order_id in ids:
        print(f"INTAKE PASS {order_id}", flush=True)
    if args.phase == "intake":
        return 0

    for name, argv in checks.items():
        print(f"RUN {name}", flush=True)
        if os.name == "nt" and (executable := shutil.which(argv[0])):
            argv = [executable, *argv[1:]]
        try:
            subprocess.run(argv, check=True)
        except subprocess.CalledProcessError as error:
            print(f"FAIL {name} (exit {error.returncode})", file=sys.stderr)
            return 1
        except (OSError, ValueError) as error:
            print(f"FAIL {name} ({error})", file=sys.stderr)
            return 1
        print(f"PASS {name}", flush=True)

    print(f"VERIFY PASS {', '.join(ids)} ({len(checks)} checks)", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
