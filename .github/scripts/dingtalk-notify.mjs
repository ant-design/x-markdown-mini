// Posts a markdown message about the current GitHub event to a DingTalk group robot.
// Env: DINGTALK_WEBHOOK, DINGTALK_SECRET (robot "加签" secret), GITHUB_EVENT_NAME,
// GITHUB_EVENT_PATH, GITHUB_REPOSITORY, GITHUB_REF_NAME, GITHUB_SERVER_URL.
// Node 18+ only (global fetch); no dependencies.
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';

const { DINGTALK_WEBHOOK, DINGTALK_SECRET, GITHUB_EVENT_NAME, GITHUB_EVENT_PATH } = process.env;
const repo = process.env.GITHUB_REPOSITORY;
const server = process.env.GITHUB_SERVER_URL || 'https://github.com';

if (!DINGTALK_WEBHOOK || !DINGTALK_SECRET) {
  console.log('DINGTALK_WEBHOOK / DINGTALK_SECRET not set, skipping.');
  process.exit(0);
}

const event = JSON.parse(readFileSync(GITHUB_EVENT_PATH, 'utf8'));

// Titles/bodies are user-supplied: keep them on one line so they can't inject headings/lists.
const clean = (s = '') => String(s).replace(/[\r\n]+/g, ' ').trim();
const excerpt = (s, max = 300) => {
  const text = clean((s || '').replace(/<!--[\s\S]*?-->/g, ''));
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

function issueMessage() {
  const { action, issue, sender } = event;
  const label = { opened: '🆕 新 Issue', closed: '✅ Issue 已关闭', reopened: '🔄 Issue 重新打开' }[action];
  if (!label) return null;
  const lines = [
    `### ${label}`,
    `**[#${issue.number} ${clean(issue.title)}](${issue.html_url})**`,
    `- 仓库：${repo}`,
    `- 操作人：${sender.login}`,
  ];
  if (action === 'opened' && issue.body) lines.push('', `> ${excerpt(issue.body)}`);
  return { title: `${label} #${issue.number}`, text: lines.join('\n') };
}

function pullMessage() {
  const { action, pull_request: pr, sender } = event;
  let label;
  if (action === 'opened') label = '🆕 新 PR';
  else if (action === 'reopened') label = '🔄 PR 重新打开';
  else if (action === 'closed') label = pr.merged ? '🎉 PR 已合并' : '❌ PR 已关闭';
  if (!label) return null;
  const lines = [
    `### ${label}`,
    `**[#${pr.number} ${clean(pr.title)}](${pr.html_url})**`,
    `- 仓库：${repo}`,
    `- 作者：${pr.user.login}`,
    `- 分支：${pr.head.label} → ${pr.base.ref}`,
  ];
  if (action === 'closed') lines.push(`- 操作人：${pr.merged ? pr.merged_by?.login || sender.login : sender.login}`);
  return { title: `${label} #${pr.number}`, text: lines.join('\n') };
}

function changelogSection(version) {
  try {
    const md = readFileSync('changelog/CHANGELOG.zh-CN.md', 'utf8');
    const start = md.indexOf(`\n## ${version}\n`);
    if (start === -1) return '';
    const rest = md.slice(start + 1);
    const next = rest.indexOf('\n## ', 1);
    return (next === -1 ? rest : rest.slice(0, next)).split('\n').slice(1).join('\n').trim();
  } catch {
    return '';
  }
}

function releaseMessage() {
  const tag = process.env.GITHUB_REF_NAME;
  const version = tag.replace(/^v/, '');
  const notes = changelogSection(version);
  const lines = [
    `### 🚀 发布新版本 ${tag}`,
    `**@ant-design/x-markdown-mini@${version}**`,
    `- npm：https://www.npmjs.com/package/@ant-design/x-markdown-mini/v/${version}`,
    `- 更新日志：https://x-markdown-mini.ant.design/changelog`,
    `- Tag：${server}/${repo}/releases/tag/${tag}`,
  ];
  if (notes) lines.push('', notes.length > 1500 ? `${notes.slice(0, 1500)}…` : notes);
  return { title: `发布 ${tag}`, text: lines.join('\n') };
}

const build = { issues: issueMessage, pull_request_target: pullMessage, push: releaseMessage }[GITHUB_EVENT_NAME];
const message = build && build();
if (!message) {
  console.log(`No notification for ${GITHUB_EVENT_NAME}/${event.action || ''}.`);
  process.exit(0);
}

const timestamp = Date.now();
const sign = createHmac('sha256', DINGTALK_SECRET).update(`${timestamp}\n${DINGTALK_SECRET}`).digest('base64');
const url = `${DINGTALK_WEBHOOK}&timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ msgtype: 'markdown', markdown: message }),
});
const result = await res.json().catch(() => ({}));
if (!res.ok || result.errcode !== 0) {
  console.error(`DingTalk rejected the message: HTTP ${res.status}`, result);
  process.exit(1);
}
console.log(`Sent: ${message.title}`);
