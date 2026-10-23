"""Run python/README.md's examples in order, as one script, in a temporary directory.

Signing is replaced by a stub (it needs an iCloud login). CI runs this after installing the package.
"""
import os
import re
import sys
import tempfile
from pathlib import Path

import shortcutkit

readme = (Path(__file__).parent.parent / "python" / "README.md").read_text()
blocks = re.findall(r"```python\n(.*?)```", readme, re.S)
signed = []
shortcutkit.Shortcut.sign = staticmethod(lambda src, dst, mode="anyone": signed.append((src, dst)) or dst)
os.chdir(tempfile.mkdtemp(prefix="shortcutkit-readme-"))
exec(compile("".join(blocks), "python/README.md", "exec"), {})
assert Path("Greeting.shortcut").exists(), "the first example did not write Greeting.shortcut"
assert signed == [("Greeting.shortcut", "Greeting-signed.shortcut")], signed
print(f"{len(blocks)} README examples ran", file=sys.stderr)
