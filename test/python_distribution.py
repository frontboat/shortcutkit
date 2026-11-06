"""Check built Python archives, then exercise an isolated installed wheel.

    python3 test/python_distribution.py python/dist/*.whl python/dist/*.tar.gz

The build frontend is a separate build dependency; this check uses only stdlib
and pip from the invoking interpreter.
"""
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import zipfile


ROOT = Path(__file__).resolve().parent.parent
PACKAGE = ROOT / "python" / "src" / "shortcutkit"
FILES = ["data/builtin-actions.json", "data/provenance.json", "data/catalog.json", "data/catalog.txt"]


def check_archive(path):
    if path.suffix == ".whl":
        with zipfile.ZipFile(path) as archive:
            contents = {name: archive.read(name) for name in archive.namelist() if not name.endswith("/")}
        prefix = "shortcutkit/"
    else:
        with tarfile.open(path) as archive:
            contents = {entry.name: archive.extractfile(entry).read() for entry in archive.getmembers() if entry.isfile()}
        roots = {name.split("/")[0] for name in contents}
        assert len(roots) == 1, f"unexpected sdist roots: {roots}"
        prefix = next(iter(roots)) + "/src/shortcutkit/"
    for name in FILES:
        member = prefix + name
        assert member in contents, f"{path.name}: missing {member}"
        assert contents[member] == (PACKAGE / name).read_bytes(), f"{path.name}: stale {member}"
    assert prefix + "catalog.py" in contents, f"{path.name}: missing catalogue API"
    print(f"{path.name}: bundled definitions, provenance, catalogue JSON/text verified")


def check_installed(wheel):
    with tempfile.TemporaryDirectory(prefix="shortcutkit-wheel-") as work:
        target = Path(work) / "installed"
        subprocess.run([sys.executable, "-m", "pip", "install", "--no-deps", "--no-compile", "--target", str(target), str(wheel)], check=True)
        script = '''
import json, pathlib, sys
sys.path.insert(0, sys.argv[1])
import shortcutkit as s
assert pathlib.Path(s.__file__).is_relative_to(pathlib.Path(sys.argv[1]))
assert s.CATALOG["schemaVersion"] == 1
assert set(s.CATALOG["actions"]) == set(s.ACTIONS)
assert s.CATALOG["provenance"] == s.PROVENANCE
for identifier, entity in s.ENTITIES.items():
    canonical = s.CATALOG["entities"][identifier]
    assert {key: value for key, value in canonical.items() if key != "properties"} == {key: value for key, value in entity.items() if key != "properties"}
    assert {key: {field: value for field, value in prop.items() if field != "typeInfo"} for key, prop in canonical["properties"].items()} == entity["properties"]
for identifier, entry in s.ACTIONS.items():
    record = s.get_action(identifier)
    assert record["identifier"] == identifier
    assert record["params"] == s.CATALOG["actions"][identifier]["params"]
assert s.Shortcut("Wheel").action(s.actions.SHOWRESULT, Text="hello")
for filename in ("builtin-actions.json", "provenance.json", "catalog.json"):
    path = pathlib.Path(s.__file__).parent / "data" / filename
    saved = path.read_bytes()
    path.unlink()
    result = __import__("subprocess").run([sys.executable, "-I", "-c", "import sys; sys.path.insert(0, sys.argv[1]); import shortcutkit; shortcutkit.Shortcut('Missing')", sys.argv[1]], capture_output=True, text=True)
    path.write_bytes(saved)
    assert result.returncode != 0 and "FileNotFoundError" in result.stderr, (filename, result.stderr)
print("Installed wheel: catalogue API, action lookup, serialization, and missing-data failures verified")
'''
        subprocess.run([sys.executable, "-I", "-c", script, str(target)], cwd=work, check=True)


def main():
    paths = [Path(value).resolve() for value in sys.argv[1:]]
    wheels = [path for path in paths if path.suffix == ".whl"]
    sdists = [path for path in paths if path.name.endswith(".tar.gz")]
    if len(wheels) != 1 or len(sdists) != 1 or len(paths) != 2:
        raise SystemExit("usage: python3 test/python_distribution.py PACKAGE.whl PACKAGE.tar.gz")
    for path in paths:
        check_archive(path)
    check_installed(wheels[0])


if __name__ == "__main__":
    main()
