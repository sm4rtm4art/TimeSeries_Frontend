.PHONY: help setup dev dev-local build start fmt fmt-check lint test test-no-check verify-types pre-commit audit lockfile-sync clean

help:
	@echo "Available targets:"
	@echo "  make setup        Cache deps and install pre-commit hooks"
	@echo "  make dev          Start development server"
	@echo "  make dev-local    Start local mock-data development server"
	@echo "  make build        Build application"
	@echo "  make start        Start production server"
	@echo "  make fmt          Format code with Deno"
	@echo "  make fmt-check    Check formatting with Deno"
	@echo "  make lint         Run Deno linter"
	@echo "  make test         Run test suite"
	@echo "  make test-no-check Run tests without type checking"
	@echo "  make verify-types Run verify-types helper task"
	@echo "  make pre-commit   Run pre-commit hooks on all files"
	@echo "  make audit        Run production dependency audit"
	@echo "  make lockfile-sync Re-resolve src/pnpm-lock.yaml under the age-gate policy"
	@echo "  make clean        Remove local build and coverage artifacts"

setup:
	@command -v deno >/dev/null 2>&1 || { echo "Deno 2.0+ is required. Install it first: https://deno.com/"; exit 1; }
	@command -v pre-commit >/dev/null 2>&1 || { echo "pre-commit is required. Install it first: https://pre-commit.com/"; exit 1; }
	deno task cache-deps
	pre-commit install --install-hooks

dev:
	deno task dev

dev-local:
	deno task dev:local

build:
	deno task build

start:
	deno task start

fmt:
	deno fmt

fmt-check:
	deno fmt --check

lint:
	deno lint

test:
	deno task test

test-no-check:
	deno task test --no-check

verify-types:
	deno task verify-types

pre-commit:
	@command -v pre-commit >/dev/null 2>&1 || { echo "pre-commit is required. Install it first: https://pre-commit.com/"; exit 1; }
	pre-commit run --all-files

audit:
	@command -v pnpm >/dev/null 2>&1 || { echo "pnpm 11+ is required for make audit."; exit 1; }
	@version=$$(pnpm --version 2>/dev/null) && major=$${version%%.*} && [ "$$major" -ge 11 ] || { echo "pnpm 11+ is required for make audit. Install it with: corepack prepare pnpm@11 --activate"; exit 1; }
	cd src && pnpm install --prod --frozen-lockfile && pnpm audit --prod --audit-level high

# Re-resolve the lockfile under src/pnpm-workspace.yaml (minimumReleaseAge).
# Use on Dependabot branches when frozen install fails with
# ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION and an older version still satisfies the range.
# If the existing lockfile already pins a too-new package, plain install may fail
# verification before re-resolving — wait until the package is >=24h old, or pin an
# aged transitive that still satisfies the range, then re-run this target.
lockfile-sync:
	@command -v pnpm >/dev/null 2>&1 || { echo "pnpm 11+ is required for make lockfile-sync."; exit 1; }
	@version=$$(pnpm --version 2>/dev/null) && major=$${version%%.*} && [ "$$major" -ge 11 ] || { echo "pnpm 11+ is required for make lockfile-sync. Install it with: corepack prepare pnpm@11 --activate"; exit 1; }
	cd src && pnpm install || { \
		echo "lockfile-sync failed. If this is ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION, wait until the flagged package is >=24h old and re-run CI, or replace it in the lockfile with an aged version that still satisfies the range."; \
		exit 1; \
	}

clean:
	rm -rf coverage coverage.lcov dist src/.next src/out src/node_modules
