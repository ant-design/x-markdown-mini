# Contributing

Thanks for your interest in contributing to `@ant-design/x-markdown-mini`!

## Workflow

We use a simple `main` + short-lived `feature/*` branch model:

- `main` is the only long-lived branch; it is always releasable.
- New work happens on a `feature/<topic>` branch (e.g. `feature/streaming-flush`).
- Bug fixes happen on a `fix/<topic>` branch (e.g. `fix/wechat-table-fallback`).
- Open a Pull Request targeting `main`. After review and CI pass, it is squash-merged.

```
main         ── A ─────── B ─────────── D(merge) ─────── tag v0.2.0 ─→ npm
                          │                  ↑
                          └─ feature/foo ────┘  (PR)
```

## Local Development

```bash
npm install
npm run build
npm test
```

Tests run with [Vitest](https://vitest.dev/). Pass `--run` to run once instead of watch mode.

## Submitting a PR

1. Fork the repo (or create a branch if you have write access).
2. Create a branch: `git checkout -b feature/my-change`.
3. Make your changes, including tests where it makes sense.
4. Run `npm run build && npm test` locally.
5. Push and open a PR against `main`.
6. The CI workflow will run build + tests on Node 18 / 20 / 22.

## Commit Messages

No strict convention required, but please keep messages descriptive. A short imperative summary line is preferred (`add wechat table fallback`).

## Releases

Releases are cut by maintainers from `main`:

```bash
npm version <patch|minor|major>   # bumps package.json and creates a tag
git push --follow-tags
```

Pushing a `v*` tag triggers the `Release` workflow, which builds, tests, and publishes to npm with provenance.

## Reporting Issues

Please include:
- A minimal reproduction (Markdown input + expected vs. actual output, or a runnable snippet).
- Target platform (微信 / 支付宝 / 抖音 / …) when relevant.
- The package version.
