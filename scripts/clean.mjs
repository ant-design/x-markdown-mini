#!/usr/bin/env node
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const includeDependencies = args.has('--all') || args.has('--deps');

const generatedPaths = [
  'dist',
  'coverage',
  'test-results.json',
  'benchmark/results.json',
  'docs-site/dist',
  'docs-site/.dumi',
  'examples/alipay/dist',
  'examples/wechat/dist',
];

const dependencyPaths = ['node_modules', 'docs-site/node_modules'];
const targets = includeDependencies
  ? [...generatedPaths, ...dependencyPaths]
  : generatedPaths;

for (const target of targets) {
  const absolute = path.join(root, target);
  if (dryRun) {
    console.log(`remove ${target}`);
    continue;
  }
  await rm(absolute, { recursive: true, force: true });
}
