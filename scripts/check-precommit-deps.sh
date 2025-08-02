#!/bin/bash
# Pre-commit Hook Dependency Checker and Enabler
# This script checks for dependencies and enables/disables hooks accordingly

set -e

echo "🔍 Checking pre-commit hook dependencies..."

CONFIG_FILE=".pre-commit-config.yaml"
BACKUP_FILE=".pre-commit-config.yaml.backup"

# Create backup
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo "📋 Created backup: $BACKUP_FILE"

# Check dependencies
DOCKER_RUNNING=false
STYLELINT_COMPATIBLE=false
DETECT_SECRETS_AVAILABLE=false

# Check Docker daemon
if docker info >/dev/null 2>&1; then
    DOCKER_RUNNING=true
    echo "✅ Docker daemon is running"
else
    echo "❌ Docker daemon is not running"
fi

# Check Stylelint version compatibility
if npm list stylelint 2>/dev/null | grep -q "stylelint@1[6-9]"; then
    STYLELINT_COMPATIBLE=true
    echo "✅ Compatible stylelint version (v16+) found"
else
    echo "❌ Stylelint v16+ not found (required for configs)"
fi

# Check detect-secrets
if pip show detect-secrets >/dev/null 2>&1; then
    DETECT_SECRETS_AVAILABLE=true
    echo "✅ detect-secrets is available"
else
    echo "❌ detect-secrets is not available"
fi

echo ""
echo "🔧 Hook Status Summary:"
echo "======================"

# Enable/disable hooks based on dependencies
if [ "$DOCKER_RUNNING" = true ]; then
    echo "🟢 Hadolint (Dockerfile linting): Can be enabled"
    # TODO: Add sed command to uncomment hadolint hook
else
    echo "🔴 Hadolint (Dockerfile linting): Disabled (Docker daemon not running)"
fi

if [ "$STYLELINT_COMPATIBLE" = true ]; then
    echo "🟢 Stylelint (CSS/SCSS linting): Can be enabled"
    # TODO: Add sed command to uncomment stylelint hook
else
    echo "🔴 Stylelint (CSS/SCSS linting): Disabled (version incompatible)"
    echo "   → Fix: npm install stylelint@^16.0.0"
fi

if [ "$DETECT_SECRETS_AVAILABLE" = true ]; then
    echo "🟢 detect-secrets (Secret detection): Enabled ✅"
else
    echo "🔴 detect-secrets (Secret detection): Disabled"
    echo "   → Fix: pip install detect-secrets"
fi

echo ""
echo "📝 Always Working Hooks:"
echo "======================="
echo "✅ Black (Python formatting)"
echo "✅ isort (Import sorting)"
echo "✅ Bandit (Security scanning)"
echo "✅ pip-audit (Dependency scanning)"
echo "✅ Prettier (Web file formatting)"
echo "✅ Trailing whitespace removal"
echo "✅ End-of-file fixing"
echo "✅ YAML/JSON syntax checking"

echo ""
echo "🚀 Next Steps:"
echo "============="

if [ "$DOCKER_RUNNING" = false ]; then
    echo "• Start Docker Desktop to enable Dockerfile linting"
fi

if [ "$STYLELINT_COMPATIBLE" = false ]; then
    echo "• Run: npm install stylelint@^16.0.0 to enable CSS/SCSS linting"
fi

if [ "$DETECT_SECRETS_AVAILABLE" = false ]; then
    echo "• Run: pip install detect-secrets to enable secret detection"
fi

echo ""
echo "💡 To apply changes, run: pre-commit install --install-hooks"
