import sys
from . import demo

if len(sys.argv) == 3 and sys.argv[1] == "demo":
    demo(sys.argv[2])
else:
    sys.exit("usage: python -m shortcutkit demo OUT.shortcut")
