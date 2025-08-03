#!/usr/bin/env python3
"""
Python Cache Cleanup Script

Safely removes Python cache files and directories:
- __pycache__ directories
- .pyc files
- .pyo files (Python optimized bytecode)

Excludes virtual environments and sensitive directories.
"""

import shutil
import sys
from pathlib import Path

# Directories to exclude from cleanup
EXCLUDE_DIRS = {
    "venv",
    ".venv",
    "env",
    ".env",
    "node_modules",
    ".git",
    ".github",
    "site-packages",
    "dist-packages",
}


def should_skip_path(path):
    """Check if a path should be skipped based on excluded directories."""
    return any(excluded in path.parts for excluded in EXCLUDE_DIRS)


def clean_pycache_directories(root_path):
    """Clean __pycache__ directories and return count."""
    count = 0
    print("Removing __pycache__ directories:")

    for pycache in root_path.rglob("__pycache__"):
        if should_skip_path(pycache):
            print(f"  ⏭️  Skipped (excluded): {pycache}")
            continue

        try:
            shutil.rmtree(pycache, ignore_errors=True)
            print(f"  ✅ Removed: {pycache}")
            count += 1
        except Exception as e:
            print(f"  ❌ Failed to remove {pycache}: {e}")

    return count


def clean_python_files(root_path, pattern, file_type):
    """Clean Python files matching a pattern and return count."""
    count = 0
    print(f"\nRemoving {file_type} files:")

    for file_path in root_path.rglob(pattern):
        if should_skip_path(file_path):
            print(f"  ⏭️  Skipped (excluded): {file_path}")
            continue

        try:
            file_path.unlink(missing_ok=True)
            print(f"  ✅ Removed: {file_path}")
            count += 1
        except Exception as e:
            print(f"  ❌ Failed to remove {file_path}: {e}")

    return count


def print_summary(pycache_count, pyc_count, pyo_count):
    """Print cleanup summary."""
    total = pycache_count + pyc_count + pyo_count

    print("\n�� Python cache cleanup completed!")
    print("Summary:")
    print(f"  📁 __pycache__ directories removed: {pycache_count}")
    print(f"  🐍 .pyc files removed: {pyc_count}")
    print(f"  ⚡ .pyo files removed: {pyo_count}")
    print(f"  📦 Total items cleaned: {total}")


def clean_python_caches():
    """Clean Python cache files and directories safely."""
    root_path = Path(".")

    print("🧹 Starting Python cache cleanup...")
    print(f"Scanning from: {root_path.resolve()}")
    print()

    # Clean different types of cache files
    pycache_count = clean_pycache_directories(root_path)
    pyc_count = clean_python_files(root_path, "*.pyc", ".pyc")
    pyo_count = clean_python_files(root_path, "*.pyo", ".pyo")

    print_summary(pycache_count, pyc_count, pyo_count)


if __name__ == "__main__":
    try:
        clean_python_caches()
    except KeyboardInterrupt:
        print("\n❌ Cleanup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Cleanup failed: {e}")
        sys.exit(1)
