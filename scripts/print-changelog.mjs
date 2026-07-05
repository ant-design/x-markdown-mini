// Lightweight changelog assembler — a slimmed-down take on ant-design/x's
// print-changelog. Reads merged commits since the last tag (or --from <ref>),
// pulls each PR's title/author via the `gh` CLI, classifies by conventional
// prefix, and prints markdown lines ready to paste into CHANGELOG.*.md.
//
// Usage:
//   node scripts/print-changelog.mjs            # since the latest tag
//   node scripts/print-changelog.mjs --from v1.0.0
//   npm run changelog -- --from v1.0.0
//
// Titles are English (from the PR); paste into CHANGELOG.en-US.md as-is and
// translate for CHANGELOG.zh-CN.md. This is a dev aid, not a CI step — it needs
// an authenticated `gh`; without it, it falls back to raw commit subjects.
import { execFileSync } from 'node:child_process';

function sh(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8' }).trim();
}
function trySh(cmd, args) {
  try {
    return sh(cmd, args);
  } catch {
    return '';
  }
}

const fromArg = process.argv.indexOf('--from');
const from =
  fromArg > -1 ? process.argv[fromArg + 1] : trySh('git', ['describe', '--tags', '--abbrev=0']);

const range = from ? `${from}..HEAD` : 'HEAD';
const log = trySh('git', ['log', range, '--pretty=%s']);
if (!log) {
  console.error(`No commits in range ${range}. Nothing to assemble.`);
  process.exit(0);
}

// Collect unique PR numbers referenced in commit subjects (#123 / (#123) /
// "Merge pull request #123"). Keep the first subject seen per PR as a fallback.
const prs = new Map();
const looseSubjects = [];
for (const subject of log.split('\n')) {
  const m = subject.match(/#(\d+)/);
  if (m) {
    const n = Number(m[1]);
    if (!prs.has(n)) prs.set(n, subject);
  } else if (subject && !/^Merge /.test(subject)) {
    looseSubjects.push(subject);
  }
}

const hasGh = !!trySh('gh', ['--version']);

// PR title / conventional prefix → changelog type. Order matters (breaking wins).
function classify(title) {
  const t = title.toLowerCase();
  if (/breaking|!:|\bbreaking change\b/.test(t)) return 'Breaking';
  if (/^feat|^add|✨|🆕/.test(t)) return 'Added';
  if (/^perf|^refactor|⚡|♻️/.test(t)) return 'Improved';
  if (/^fix|^bug|🐛/.test(t)) return 'Fixed';
  if (/^docs|^chore|^test|^ci|^build/.test(t)) return 'Docs/Chore';
  return 'Added';
}
// Strip the conventional prefix so the line reads as prose.
function cleanTitle(title) {
  return title.replace(/^\w+(\([^)]*\))?!?:\s*/, '').trim();
}

const lines = [];
for (const [n, fallback] of [...prs.entries()].sort((a, b) => b[0] - a[0])) {
  let title = fallback;
  let author = '';
  let url = `https://github.com/ant-design/x-markdown-mini/pull/${n}`;
  if (hasGh) {
    const json = trySh('gh', [
      'pr',
      'view',
      String(n),
      '--json',
      'title,author,url',
    ]);
    if (json) {
      try {
        const data = JSON.parse(json);
        title = data.title || title;
        author = data.author?.login || '';
        url = data.url || url;
      } catch {
        /* fall back to commit subject */
      }
    }
  }
  const type = classify(title);
  const by = author ? ` by [@${author}](https://github.com/${author})` : '';
  lines.push(`- **${type}**: ${cleanTitle(title)} [#${n}](${url})${by}`);
}
for (const subject of looseSubjects) {
  lines.push(`- **${classify(subject)}**: ${cleanTitle(subject)}`);
}

console.log(`\n# Changelog draft — commits in ${range}${hasGh ? '' : ' (no gh: raw subjects)'}\n`);
console.log('Paste into CHANGELOG.en-US.md, translate for CHANGELOG.zh-CN.md.\n');
console.log(lines.join('\n'));
console.log('');
