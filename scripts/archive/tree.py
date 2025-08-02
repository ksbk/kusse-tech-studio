#!/usr/bin/env python3
# Save as `tree.py` in your project root
# Usage: python tree.py [max_depth]

from pathlib import Path
import argparse

# Color codes
COLORS = {
    "header": "\033[1;34m",
    "root": "\033[1;33m",
    "dir": "\033[0;36m",
    "file": "\033[0;32m",
    "reset": "\033[0m",
    "tip": "\033[1;32m",
}

IGNORE = {
    "node_modules",
    ".git",
    ".next",
    "__pycache__",
    ".venv",
    ".idea",
    "dist",
    "build",
    "bin",
    ".tree.py",
    ".DS_Store",
    ".ruff_cache",
    ".mypy_cache",
    ".pytest_cache",
    "coverage.xml",
    "htmlcov",
    "coverage",
    ".pytest_cache",
    "migrations",
    "tests/__snapshots__",
    ".trunk",
    "plugins",
    "archive",
}


def print_tree(path, prefix="", depth=0, max_depth=3):
    if depth > max_depth:
        return

    path = Path(path)
    contents = sorted([p for p in path.iterdir() if p.name not in IGNORE])

    for i, child in enumerate(contents):
        is_last = i == len(contents) - 1
        marker = "└── " if is_last else "├── "

        if child.is_dir():
            print(f"{prefix}{marker}{COLORS['dir']}{child.name}{COLORS['reset']}")
            new_prefix = prefix + ("    " if is_last else "│   ")
            print_tree(child, new_prefix, depth + 1, max_depth)
        else:
            print(f"{prefix}{marker}{COLORS['file']}{child.name}{COLORS['reset']}")


def main():
    parser = argparse.ArgumentParser(description="Project tree visualizer")
    parser.add_argument("--depth", type=int, default=3, help="Max depth to display")
    args = parser.parse_args()

    print(f"{COLORS['header']}RealSynthesis Project Structure{COLORS['reset']}")
    print(f"{COLORS['root']}. (root){COLORS['reset']}")
    print_tree(".", max_depth=args.depth)
    print(f"\n{COLORS['tip']}Tip: Use '--depth N' to show more levels{COLORS['reset']}")


if __name__ == "__main__":
    main()
