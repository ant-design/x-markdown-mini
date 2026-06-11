import React, { useMemo, useState } from 'react';
import { useDocPlatform } from '../useDocPlatform';
import './index.less';

export type DemoPlatform = 'alipay' | 'wechat';

export interface PlatformCode {
  template: string;
  script?: string;
  style?: string;
  json?: string;
}

/** 平台无关代码文件（TS 片段、Markdown 输入等） */
export interface DemoFile {
  name: string;
  lang?: string;
  code: string;
}

export interface DemoCodeProps {
  alipay?: PlatformCode;
  wechat?: PlatformCode;
  /** 提供 files 时使用平台无关模式，忽略 alipay / wechat */
  files?: DemoFile[];
}

type FileKey = 'template' | 'script' | 'style' | 'json';

const FILE_LABELS: Record<DemoPlatform, Record<FileKey, string>> = {
  alipay: { template: 'index.axml', script: 'index.js', style: 'index.acss', json: 'index.json' },
  wechat: { template: 'index.wxml', script: 'index.js', style: 'index.wxss', json: 'index.json' },
};

const FILE_LANG: Record<FileKey, string> = {
  template: 'xml',
  script: 'js',
  style: 'css',
  json: 'json',
};

function platformFiles(code: PlatformCode, platform: DemoPlatform): DemoFile[] {
  const keys: FileKey[] = ['template'];
  if (code.script) keys.push('script');
  if (code.style) keys.push('style');
  if (code.json) keys.push('json');
  return keys.map((k) => ({
    name: FILE_LABELS[platform][k],
    lang: FILE_LANG[k],
    code: code[k]!,
  }));
}

export const DemoCode: React.FC<DemoCodeProps> = ({ alipay, wechat, files }) => {
  const [platform] = useDocPlatform();
  const [active, setActive] = useState(0);

  const resolved = useMemo<DemoFile[]>(() => {
    if (files && files.length > 0) return files;
    const code = platform === 'alipay' ? alipay : wechat;
    return code ? platformFiles(code, platform) : [];
  }, [files, platform, alipay, wechat]);

  const index = Math.min(active, Math.max(resolved.length - 1, 0));
  const file = resolved[index];

  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    if (!file) return;
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  if (!file) return null;

  return (
    <div className="xmd-demo-code">
      <div className="xmd-demo-code-head">
        <div className="xmd-demo-code-files">
          {resolved.map((f, i) => (
            <button
              key={f.name}
              type="button"
              className={`xmd-demo-code-file ${i === index ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {f.name}
            </button>
          ))}
        </div>
        <button type="button" className="xmd-demo-code-copy" onClick={onCopy}>
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className={`language-${file.lang ?? 'text'}`}>
        <code>{file.code}</code>
      </pre>
    </div>
  );
};

export default DemoCode;
