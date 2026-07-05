import React from 'react';
import ChangelogTimeline from './ChangelogTimeline';
import { ZH } from './data';

// 中文更新日志页（/changelog）。结构与文案分离：时间轴布局在 ChangelogTimeline，
// 文本在 data.tsx 的 ZH。英文版见 Changelog.en-US.tsx。
export default function Changelog() {
  return <ChangelogTimeline copy={ZH} />;
}
