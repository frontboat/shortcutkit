"""Bundle the repository skill in wheels and self-contained source archives."""
from pathlib import Path
from shutil import copytree, rmtree

from setuptools import setup
from setuptools.command.build_py import build_py
from setuptools.command.sdist import sdist


ROOT = Path(__file__).resolve().parent


def copy_skill(destination):
    # Repository builds use the canonical source; sdist builds use its bundled copy.
    source = ROOT.parent / "skills" / "shortcutkit"
    if not source.is_dir():
        source = ROOT / "src" / "shortcutkit" / "skills" / "shortcutkit"
    if not (source / "SKILL.md").is_file():
        raise FileNotFoundError(f"ShortcutKit skill is missing: {source}")
    if destination.exists():
        rmtree(destination)
    copytree(source, destination)


class BuildPy(build_py):
    def run(self):
        super().run()
        copy_skill(Path(self.build_lib) / "shortcutkit" / "skills" / "shortcutkit")


class Sdist(sdist):
    def make_release_tree(self, base_dir, files):
        super().make_release_tree(base_dir, files)
        copy_skill(Path(base_dir) / "src" / "shortcutkit" / "skills" / "shortcutkit")


setup(cmdclass={"build_py": BuildPy, "sdist": Sdist})
