#!/usr/bin/env python3

"""Generate directory tree for the gold-standard structure."""

from pathlib import Path


def generate_tree(start_path, prefix="", max_depth=None, current_depth=0):
    """Generate a tree structure of directories and files."""
    if max_depth is not None and current_depth > max_depth:
        return

    path = Path(start_path)
    if not path.exists():
        return

    # Get all items and sort them (directories first, then files)
    items = list(path.iterdir())
    items.sort(key=lambda x: (x.is_file(), x.name.lower()))

    # Filter out unwanted directories and files
    excluded = {
        "__pycache__",
        ".git",
        "node_modules",
        ".pytest_cache",
        "migration_backup",
        "temp_backup",
        ".DS_Store",
        "*.pyc",
        "htmlcov",
        ".coverage",
        ".env",
        "logs",
    }

    items = [
        item
        for item in items
        if item.name not in excluded and not item.name.startswith(".")
    ]

    for i, item in enumerate(items):
        is_last = i == len(items) - 1
        current_prefix = "└── " if is_last else "├── "
        print(f"{prefix}{current_prefix}{item.name}")

        if item.is_dir() and (max_depth is None or current_depth < max_depth):
            extension = "    " if is_last else "│   "
            generate_tree(item, prefix + extension, max_depth, current_depth + 1)


def main():
    """Main function."""
    print("KusseTechStudio - Gold Standard Directory Structure")
    print("=" * 55)
    print("kusse-tech-studio/")
    generate_tree(".", max_depth=4)


if __name__ == "__main__":
    main()
