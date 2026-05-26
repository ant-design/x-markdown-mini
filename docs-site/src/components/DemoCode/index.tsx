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

export interface DemoCodeProps {
  alipay: PlatformCode;
  wechat: PlatformCode;
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

function fileKeysOf(code: PlatformCode): FileKey[] {
  const keys: FileKey[] = ['template'];
  if (code.script) keys.push('script');
  if (code.style) keys.push('style');
  if (code.json) keys.push('json');
  return keys;
}

export const DemoCode: React.FC<DemoCodeProps> = ({ alipay, wechat }) => {
  const [platform] = useDocPlatform();
  const [file, setFile] = useState<FileKey>('template');

  const code = platform === 'alipay' ? alipay : wechat;
  const keys = useMemo(() => fileKeysOf(code), [code]);
  const activeFile: FileKey = keys.includes(file) ? file : 'template';
  const codeText = code[activeFile] ?? '';

  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="xmd-demo-code">
      <div className="xmd-demo-code-head">
        <div className="xmd-demo-code-files">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              className={`xmd-demo-code-file ${k === activeFile ? 'is-active' : ''}`}
              onClick={() => setFile(k)}
            >
              {FILE_LABELS[platform][k]}
            </button>
          ))}
        </div>
        <button type="button" className="xmd-demo-code-copy" onClick={onCopy}>
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className={`language-${FILE_LANG[activeFile]}`}>
        <code>{codeText}</code>
      </pre>
    </div>
  );
};

export default DemoCode;
