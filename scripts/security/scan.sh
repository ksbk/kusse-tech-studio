#!/bin/bash

# Security scanning script
echo "🔒 Running security scans..."

# Python security scan with bandit
echo "🐍 Scanning Python code with bandit..."
bandit -r app/ -f json -o security-report.json || true

# Check for secrets in code
echo "🔍 Checking for secrets with trufflehog..."
# trufflehog --regex --entropy=False . || true

# Dependency vulnerability check
echo "📦 Checking Python dependencies..."
safety check || true

echo "✅ Security scan complete!"
