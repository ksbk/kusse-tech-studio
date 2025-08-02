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


def clean_python_caches():
    """Clean Python cache files and directories safely."""

    # Directories to exclude from cleanup
    exclude_dirs = {
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

    # Start from current directory
    root_path = Path(".")

    # Track what we're cleaning
    pycache_count = 0
    pyc_count = 0
    pyo_count = 0

    print("🧹 Starting Python cache cleanup...")
    print(f"Scanning from: {root_path.resolve()}")
    print()

    # Clean __pycache__ directories
    print("Removing __pycache__ directories:")
    for pycache in root_path.rglob("__pycache__"):
        # Check if this cache dir is in an excluded directory
        if any(excluded in pycache.parts for excluded in exclude_dirs):
            print(f"  ⏭️  Skipped (excluded): {pycache}")
            continue

        try:
            shutil.rmtree(pycache, ignore_errors=True)
            print(f"  ✅ Removed: {pycache}")
            pycache_count += 1
        except Exception as e:
            print(f"  ❌ Failed to remove {pycache}: {e}")

    print()

    # Clean .pyc files
    print("Removing .pyc files:")
    for pyc in root_path.rglob("*.pyc"):
        # Check if this pyc file is in an excluded directory
        if any(excluded in pyc.parts for excluded in exclude_dirs):
            print(f"  ⏭️  Skipped (excluded): {pyc}")
            continue

        try:
            pyc.unlink(missing_ok=True)
            print(f"  ✅ Removed: {pyc}")
            pyc_count += 1
        except Exception as e:
            print(f"  ❌ Failed to remove {pyc}: {e}")

    print()

    # Clean .pyo files (Python optimized bytecode)
    print("Removing .pyo files:")
    for pyo in root_path.rglob("*.pyo"):
        # Check if this pyo file is in an excluded directory
        if any(excluded in pyo.parts for excluded in exclude_dirs):
            print(f"  ⏭️  Skipped (excluded): {pyo}")
            continue

        try:
            pyo.unlink(missing_ok=True)
            print(f"  ✅ Removed: {pyo}")
            pyo_count += 1
        except Exception as e:
            print(f"  ❌ Failed to remove {pyo}: {e}")

    print()
    print("🎉 Python cache cleanup completed!")
    print("Summary:")
    print(f"  📁 __pycache__ directories removed: {pycache_count}")
    print(f"  🐍 .pyc files removed: {pyc_count}")
    print(f"  ⚡ .pyo files removed: {pyo_count}")
    print(f"  📦 Total items cleaned: {pycache_count + pyc_count + pyo_count}")


if __name__ == "__main__":
    try:
        clean_python_caches()
    except KeyboardInterrupt:
        print("\n❌ Cleanup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Cleanup failed: {e}")
        sys.exit(1)
