#!/bin/bash

# Comprehensive linting script
echo "🧹 Running code quality checks..."

# Check for deprecated Docker Compose file patterns
echo "🐳 Checking Docker Compose file naming conventions..."
DEPRECATED_FILES=$(find . -name "*.dev.yml" -o -name "*.prod.yml" 2>/dev/null)
if [[ -n ${DEPRECATED_FILES} ]]; then
	echo "❌ ERROR: Found deprecated Docker Compose files:"
	echo "${DEPRECATED_FILES}"
	echo ""
	echo "Please rename to use full environment names:"
	echo "  *.dev.yml  → *.development.yml"
	echo "  *.prod.yml → *.production.yml"
	exit 1
else
	echo "✅ Docker Compose file naming conventions check passed"
fi

# Check for deprecated references in files
echo "🔍 Checking for deprecated Docker Compose references..."
DEPRECATED_REFS=$(grep -r "\.dev\.yml\|\.prod\.yml" --exclude-dir=.git --exclude-dir=archive --exclude="*.md" --exclude="lint.sh" . 2>/dev/null || true)
if [[ -n ${DEPRECATED_REFS} ]]; then
	echo "❌ ERROR: Found references to deprecated Docker Compose files:"
	echo "${DEPRECATED_REFS}"
	echo ""
	echo "Please update references to use full environment names"
	exit 1
else
	echo "✅ No deprecated Docker Compose references found"
fi

# Python linting
echo "🐍 Python linting..."
flake8 app/ config/ tests/ || true
black --check app/ config/ tests/ || true
isort --check-only app/ config/ tests/ || true

# JavaScript/TypeScript linting
echo "📜 JavaScript linting..."
npm run lint || true

# CSS linting
echo "🎨 CSS linting..."
npm run lint:css || true

echo "✅ Linting complete!"
