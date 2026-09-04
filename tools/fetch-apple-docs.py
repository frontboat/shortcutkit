#!/usr/bin/env python3
"""Fetch Apple developer documentation as markdown.

Every page on developer.apple.com/documentation has a markdown twin at the same
URL with ".md" appended, and a render-JSON at /tutorials/data/<path>.json whose
"topicSections" list a page's children and whose "references" list every page
it links to.

usage:
  fetch-apple-docs.py OUTDIR PATH [PATH ...]           # fetch these pages
  fetch-apple-docs.py --children OUTDIR PATH [...]     # plus each page's topic children
  fetch-apple-docs.py --references OUTDIR PATH [...]   # plus every page each one links to

PATH is a documentation path such as /documentation/appintents/app-shortcuts.
Writes one .md per page plus _index.json mapping path -> file. Skips paths already
present in an existing _index.json in OUTDIR.
"""
import concurrent.futures
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

UA = {"User-Agent": "Mozilla/5.0"}
BASE = "https://developer.apple.com"


def get(url, timeout=30):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


def render_json(path):
    try:
        return json.loads(get(f"{BASE}/tutorials/data{path}.json"))
    except (urllib.error.HTTPError, urllib.error.URLError, json.JSONDecodeError):
        return None


def normalise(identifier):
    return "/documentation/" + identifier.split("/documentation/")[-1].lower()


def children(path):
    data = render_json(path)
    if not data:
        return set()
    return {normalise(i) for s in data.get("topicSections", []) for i in s.get("identifiers", []) if "/documentation/" in i}


def references(path):
    data = render_json(path)
    found = set()

    def walk(node):
        if isinstance(node, dict):
            for k, v in node.items():
                if k == "url" and isinstance(v, str) and v.startswith("/documentation/"):
                    found.add(v.split("#")[0].lower())
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(data or {})
    return found


def filename(path):
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", path[len("/documentation/"):]).strip("_")
    m = re.search(r"\(([^)]*)\)$", path)
    if m and m.group(1).count(":") > 1:  # keep Swift overloads apart: buildBlock(_:_:) vs buildBlock(_:_:_:)
        base += f"_{m.group(1).count(':')}"
    return base + ".md"


def fetch(path):
    url = f"{BASE}{urllib.parse.quote(path, safe='/:()-._')}.md"
    try:
        return path, 200, get(url)
    except urllib.error.HTTPError as e:
        return path, e.code, b""
    except urllib.error.URLError:
        return path, -1, b""


def main(argv):
    mode = None
    if argv and argv[0] in ("--children", "--references"):
        mode, argv = argv[0], argv[1:]
    if len(argv) < 2:
        sys.exit(__doc__)
    out = pathlib.Path(argv[0])
    out.mkdir(parents=True, exist_ok=True)
    seeds = {p.lower() for p in argv[1:]}
    if mode:
        expand = children if mode == "--children" else references
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
            for found in ex.map(expand, sorted(seeds)):
                seeds |= found
    index_path = out / "_index.json"
    index = json.load(open(index_path)) if index_path.exists() else {"fetched": []}
    have = {e["path"].lower() for e in index["fetched"]}
    todo = sorted(p for p in seeds if p not in have)
    print(f"{len(seeds)} paths, {len(todo)} new")
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        results = list(ex.map(fetch, todo))
    ok = 0
    for path, status, body in results:
        if status == 200:
            (out / filename(path)).write_bytes(body)
            index["fetched"].append({"path": path, "status": status, "bytes": len(body), "file": filename(path)})
            ok += 1
        else:
            print(f"  FAIL {status} {path}")
    json.dump(index, open(index_path, "w"), indent=2)
    print(f"fetched {ok}, failed {len(results) - ok}, index now {len(index['fetched'])}")


if __name__ == "__main__":
    main(sys.argv[1:])
