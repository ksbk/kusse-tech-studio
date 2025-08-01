# Security Scripts

This directory contains security-related automation scripts.

## Scripts

- `scan.sh` - Runs comprehensive security scans including:
  - Bandit for Python code analysis
  - Safety for dependency vulnerability checks
  - TruffleHog for secret detection (when available)

## Usage

```bash
./scripts/security/scan.sh
```

## Dependencies

Install security tools:

```bash
pip install bandit safety
# Optional: Install trufflehog for secret scanning
```
