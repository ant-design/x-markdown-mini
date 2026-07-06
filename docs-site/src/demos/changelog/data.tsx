import { ZH_RELEASES, EN_RELEASES } from './changelog.generated';
import type { GeneratedRelease } from './changelog.generated';

// Site chrome for the changelog page. The version ENTRIES are the single source
// of truth in changelog/CHANGELOG.{zh-CN,en-US}.md, parsed into
// changelog.generated.ts by docs-site/scripts/build-changelog.mjs (predev/
// prebuild). Only the page title / subtitle / chip labels live here.
export type ChangeType = 'breaking' | 'feature' | 'fix' | 'perf';
export type Release = GeneratedRelease;

export interface ChangelogCopy {
  title: string;
  subtitle: string;
  /** 最新版本的角标文案。 */
  latest: string;
  /** 各类型标签的显示文案。 */
  types: Record<ChangeType, string>;
  releases: Release[];
}

export const ZH: ChangelogCopy = {
  title: '更新日志',
  subtitle:
    '面向使用者的 API、构建产物与行为变化都记录在这里。迁移说明写在对应版本下，方便升级时按版本逐条核对。',
  latest: '最新',
  types: {
    breaking: '破坏性',
    feature: '新增',
    fix: '修复',
    perf: '优化',
  },
  releases: ZH_RELEASES,
};

export const EN: ChangelogCopy = {
  title: 'Changelog',
  subtitle:
    'User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.',
  latest: 'Latest',
  types: {
    breaking: 'Breaking',
    feature: 'Added',
    fix: 'Fixed',
    perf: 'Improved',
  },
  releases: EN_RELEASES,
};
