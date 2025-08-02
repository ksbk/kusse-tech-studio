#!/bin/bash
# Pre-commit hook for KusseTechStudio
# Runs linting and security scans before allowing commits

set -e

echo "🔍 Running pre-commit checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "Makefile" ]; then
    print_error "Makefile not found. Please run from project root."
    exit 1
fi

# Array to track failures
failures=()

echo ""
echo "📝 Running linting checks..."

# Run linting
if make lint > /dev/null 2>&1; then
    print_status "Code linting passed"
else
    print_error "Code linting failed"
    failures+=("lint")
fi

echo ""
echo "🔒 Running security scans..."

# Run security scan
if make security-scan > /dev/null 2>&1; then
    print_status "Security scan passed"
else
    print_error "Security scan failed"
    failures+=("security")
fi

echo ""
echo "🧹 Running Python cache cleanup..."

# Run cache cleanup
if make clean-cache > /dev/null 2>&1; then
    print_status "Cache cleanup completed"
else
    print_warning "Cache cleanup had issues (non-blocking)"
fi

# Check for failures
if [ ${#failures[@]} -eq 0 ]; then
    echo ""
    print_status "All pre-commit checks passed! 🎉"
    echo ""
    exit 0
else
    echo ""
    print_error "Pre-commit checks failed:"
    for failure in "${failures[@]}"; do
        echo "  - $failure"
    done
    echo ""
    echo "Please fix the issues above before committing."
    echo "You can run the following commands to see detailed output:"
    echo ""
    if [[ " ${failures[@]} " =~ " lint " ]]; then
        echo "  make lint"
    fi
    if [[ " ${failures[@]} " =~ " security " ]]; then
        echo "  make security-scan"
    fi
    echo ""
    echo "To skip pre-commit hooks (not recommended), use:"
    echo "  git commit --no-verify"
    echo ""
    exit 1
fi
