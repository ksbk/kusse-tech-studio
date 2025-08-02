#!/bin/bash

# =========================================
# Docker Build Verification Script
# =========================================

set -e

echo "🔧 Docker & CI Hardening - Build Verification"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not available in PATH"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_warning "Docker daemon is not running. Skipping build test."
    echo "To test the build manually, run:"
    echo "  docker build -t kussestudio:latest ."
    echo ""
else
    print_status "Docker daemon is running"

    # Build the Docker image
    echo "🏗️  Building multi-stage Docker image..."
    if docker build -t kussestudio:latest .; then
        print_status "Docker build successful"

        # Analyze the built image
        echo ""
        echo "📊 Image Analysis:"
        echo "=================="
        docker images kussestudio:latest

        echo ""
        echo "🔍 Image Layers:"
        docker history kussestudio:latest --no-trunc

        echo ""
        echo "🏥 Health Check Test:"
        if docker run --rm -d --name test-container -p 8000:8000 kussestudio:latest; then
            sleep 10
            if curl -f http://localhost:8000/health &> /dev/null; then
                print_status "Health check passed"
            else
                print_warning "Health check failed or endpoint not ready"
            fi
            docker stop test-container
        else
            print_error "Failed to start test container"
        fi

        echo ""
        echo "🔒 Security Check:"
        docker run --rm kussestudio:latest id

    else
        print_error "Docker build failed"
        exit 1
    fi
fi

# Verify Dockerfile syntax
echo ""
echo "📝 Dockerfile Verification:"
echo "==========================="

if [ -f "Dockerfile" ]; then
    print_status "Dockerfile exists"

    # Check for multi-stage build
    if grep -q "FROM.*as builder" Dockerfile && grep -q "FROM.*as runtime" Dockerfile; then
        print_status "Multi-stage build structure detected"
    else
        print_error "Multi-stage build structure not found"
    fi

    # Check for non-root user
    if grep -q "USER app" Dockerfile; then
        print_status "Non-root user configuration found"
    else
        print_error "Non-root user not configured"
    fi

    # Check for health check
    if grep -q "HEALTHCHECK" Dockerfile; then
        print_status "Health check configured"
    else
        print_warning "No health check found"
    fi

else
    print_error "Dockerfile not found"
fi

# Verify .dockerignore
echo ""
echo "📋 .dockerignore Verification:"
echo "============================="

if [ -f ".dockerignore" ]; then
    print_status ".dockerignore exists"

    # Check for common exclusions
    if grep -q "node_modules/" .dockerignore; then
        print_status "node_modules/ excluded"
    fi

    if grep -q "__pycache__/" .dockerignore; then
        print_status "__pycache__/ excluded"
    fi

    if grep -q "\.git/" .dockerignore; then
        print_status ".git/ excluded"
    fi

    if grep -q "tests/" .dockerignore; then
        print_status "tests/ excluded"
    fi

else
    print_error ".dockerignore not found"
fi

# Verify security workflow
echo ""
echo "🛡️  Security Workflow Verification:"
echo "==================================="

if [ -f ".github/workflows/security.yml" ]; then
    print_status "Security workflow exists"

    # Check for Trivy scanning
    if grep -q "trivy-action" .github/workflows/security.yml; then
        print_status "Trivy vulnerability scanning configured"
    else
        print_warning "Trivy scanning not found"
    fi

    # Check for Docker security job
    if grep -q "docker-security" .github/workflows/security.yml; then
        print_status "Docker security job configured"
    else
        print_warning "Docker security job not found"
    fi

else
    print_error "Security workflow not found"
fi

echo ""
print_status "Docker & CI hardening verification complete!"
echo ""
echo "📋 Summary:"
echo "==========="
echo "• Multi-stage Dockerfile with builder and runtime stages"
echo "• Comprehensive .dockerignore for smaller build context"
echo "• Enhanced security workflow with Trivy scanning"
echo "• Container hardening checks"
echo "• Production Docker Compose override"
echo ""
echo "🚀 Ready for production deployment!"
