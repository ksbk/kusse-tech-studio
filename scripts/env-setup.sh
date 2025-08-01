#!/bin/bash

# Environment Setup Script for KusseTechStudio
# Manages .env file policy: root .env links to envs/.env.development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
	echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
	echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
	echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
	echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the project root
if [[ ! -f "pyproject.toml" ]] || [[ ! -d "envs" ]]; then
	log_error "Please run this script from the project root directory"
	exit 1
fi

# Function to setup development environment
setup_dev() {
	log_step "Setting up development environment..."

	# Backup existing .env if it exists and isn't a symlink
	if [[ -f ".env" ]] && [[ ! -L ".env" ]]; then
		log_warn "Backing up existing .env to .env.backup"
		cp .env .env.backup
	fi

	# Remove existing .env (file or symlink)
	if [[ -e ".env" ]]; then
		rm .env
	fi

	# Create symlink to development environment
	ln -s envs/.env.development .env
	log_info "Created symlink: .env -> envs/.env.development"

	# Verify symlink
	if [[ -L ".env" ]]; then
		log_info "✅ Environment setup complete for development"
		log_info "   Active config: $(readlink .env)"
	else
		log_error "Failed to create symlink"
		exit 1
	fi
}

# Function to setup for specific environment
setup_env() {
	local env_name=$1
	local env_file="envs/.env.${env_name}"

	if [[ ! -f ${env_file} ]]; then
		log_error "Environment file ${env_file} does not exist"
		exit 1
	fi

	log_step "Setting up ${env_name} environment..."

	# Remove existing .env (file or symlink)
	if [[ -e ".env" ]]; then
		rm .env
	fi

	# Create symlink to specified environment
	ln -s "${env_file}" .env
	log_info "Created symlink: .env -> ${env_file}"

	log_info "✅ Environment setup complete for ${env_name}"
}

# Function to show current environment status
show_status() {
	echo
	log_step "Environment Status:"

	if [[ -L ".env" ]]; then
		local target=$(readlink .env)
		log_info "✅ .env is a symlink pointing to ${target}"

		if [[ -f ".env" ]]; then
			echo
			log_info "Environment variables preview:"
			head -5 .env | while read line; do
				if [[ ${line} =~ ^[A-Z] ]]; then
					echo "   ${line}"
				fi
			done
		fi
	elif [[ -f ".env" ]]; then
		log_warn "⚠️  .env is a regular file (should be a symlink)"
		log_info "   Run 'bash scripts/env-setup.sh dev' to fix this"
	else
		log_warn "⚠️  No .env file found"
		log_info "   Run 'bash scripts/env-setup.sh dev' to create development setup"
	fi

	echo
	log_info "Available environment files:"
	ls -la envs/.env.* | while read line; do
		echo "   ${line}"
	done
	echo
}

# Function to verify environment files
verify_envs() {
	log_step "Verifying environment files..."

	local required_envs=("development" "staging" "production")
	local missing=()

	for env in "${required_envs[@]}"; do
		if [[ ! -f "envs/.env.${env}" ]]; then
			missing+=(${env})
		else
			log_info "✅ envs/.env.${env} exists"
		fi
	done

	if [[ ${#missing[@]} -gt 0 ]]; then
		log_error "Missing environment files: ${missing[*]}"
		log_info "Please create these files based on .env.example"
		exit 1
	fi

	log_info "✅ All required environment files present"
}

# Main script logic
case "${1:-status}" in
"dev" | "development")
	verify_envs
	setup_dev
	;;
"staging")
	verify_envs
	setup_env "staging"
	;;
"production" | "prod")
	verify_envs
	setup_env "production"
	;;
"status")
	show_status
	;;
"verify")
	verify_envs
	;;
"help" | "-h" | "--help")
	echo "Environment Setup Script for KusseTechStudio"
	echo
	echo "Usage: bash scripts/env-setup.sh [command]"
	echo
	echo "Commands:"
	echo "  dev, development  Setup development environment (default for local)"
	echo "  staging          Setup staging environment"
	echo "  production, prod Setup production environment"
	echo "  status           Show current environment status"
	echo "  verify           Verify all environment files exist"
	echo "  help             Show this help message"
	echo
	echo "The script manages the .env symlink policy:"
	echo "  - Root .env always points to envs/.env.{environment}"
	echo "  - Development uses envs/.env.development by default"
	echo "  - Production deployments use envs/.env.production"
	echo
	;;
*)
	log_error "Unknown command: $1"
	log_info "Run 'bash scripts/env-setup.sh help' for usage information"
	exit 1
	;;
esac
