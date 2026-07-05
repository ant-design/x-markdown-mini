import React from 'react';
import ChangelogTimeline from './ChangelogTimeline';
import { EN } from './data';

// English changelog page (/changelog-en). Shares the timeline layout with the
// zh version; copy lives in data.tsx (EN).
export default function Changelog() {
  return <ChangelogTimeline copy={EN} />;
}
