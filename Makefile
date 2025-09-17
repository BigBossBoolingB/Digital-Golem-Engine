# Simple local CI-style helpers

.PHONY: fmt-check lint build test preflight

fmt-check:
	cargo fmt -- --check

lint:
	cargo clippy -- -D warnings

build:
	cargo build

test:
	cargo test --all

preflight: fmt-check lint build test
