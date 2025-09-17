# Contributing to Digital Golem Engine

Until GitHub Actions is unlocked, we enforce a strict local pre-flight checklist before any commit is pushed. Treat your local workstation as the CI server.

## Branching
- Work on a feature branch off main:
  - git checkout main
  - git pull
  - git checkout -b feature/your-feature-name

## Local Pre-Flight Checklist (must pass in this order)
1) cargo fmt -- --check
2) cargo clippy -- -D warnings
3) cargo build
4) cargo test --all

If any step fails, fix the issue and rerun from step 1.

## Commit and PR
- Stage only intended files (avoid git add .)
- Example:
  - git add path/to/file.rs tests/
  - git commit -m "feat: concise description"
  - git push origin feature/your-feature-name
- Open a PR and explicitly state that all local checks passed.
- When Actions is unlocked, CI will run the same steps automatically.

## Notes
- Do not weaken lint rules or skip steps.
- Keep tests minimal but meaningful; expand coverage alongside new features.
- Prefer small, focused commits.
