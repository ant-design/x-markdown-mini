import React, { useMemo, useState } from 'react';
import Highlight, { defaultProps, type Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';
import { useDocPlatform } from '../useDocPlatform';
import './index.less';

/** Map our file-language tags to the language ids prism-react-renderer bundles. */
const PRISM_LANG: Record<string, Language> = {
  js: 'javascript',
  ts: 'typescript',
  xml: 'markup',
  md: 'markdown',
};

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
  /** 默认激活的文件名。找不到时回退到第一个文件。 */
  defaultFile?: string;
  /** 仅展示给定的平台文件（如 ['template','json'] 作「使用方式」精简片段）。files 模式忽略。 */
  pick?: FileKey[];
  minHeight?: number | string;
  maxHeight?: number | string;
  copyLabel?: string;
  title?: string;
  /** 是否可折叠。false 时无折叠头、始终展开（用于「使用方式」片段）。 */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
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

function platformFiles(code: PlatformCode, platform: DemoPlatform, pick?: FileKey[]): DemoFile[] {
  let keys: FileKey[] = ['template'];
  if (code.script) keys.push('script');
  if (code.style) keys.push('style');
  if (code.json) keys.push('json');
  if (pick && pick.length > 0) keys = pick.filter((k) => keys.includes(k));
  return keys.map((k) => ({
    name: FILE_LABELS[platform][k],
    lang: FILE_LANG[k],
    code: code[k]!,
  }));
}

function toCssSize(value: number | string | undefined) {
  if (typeof value === 'number') return `${value}px`;
  return value;
}

export const DemoCode: React.FC<DemoCodeProps> = ({
  alipay,
  wechat,
  files,
  defaultFile,
  pick,
  minHeight,
  maxHeight,
  copyLabel = '复制',
  title = 'Demo Code',
  collapsible = true,
  defaultCollapsed = true,
}) => {
  const [platform] = useDocPlatform();
  const [activeName, setActiveName] = useState<string | undefined>(defaultFile);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const resolved = useMemo<DemoFile[]>(() => {
    if (files && files.length > 0) return files;
    const code = platform === 'alipay' ? alipay : wechat;
    return code ? platformFiles(code, platform, pick) : [];
  }, [files, platform, alipay, wechat, pick]);

  React.useEffect(() => {
    setActiveName(defaultFile);
  }, [defaultFile, platform]);

  const activeIndex = useMemo(() => {
    if (!activeName) return 0;
    const exact = resolved.findIndex((f) => f.name === activeName);
    if (exact >= 0) return exact;
    const partial = resolved.findIndex((f) => f.name.includes(activeName));
    return partial >= 0 ? partial : 0;
  }, [activeName, resolved]);

  const index = Math.min(activeIndex, Math.max(resolved.length - 1, 0));
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

  const open = collapsible ? !collapsed : true;

  const style = {
    '--xmd-demo-code-min-h': toCssSize(minHeight),
    '--xmd-demo-code-max-h': toCssSize(maxHeight),
  } as React.CSSProperties;

  return (
    <div
      className={`xmd-demo-code ${open ? 'is-expanded' : 'is-collapsed'} ${
        collapsible ? '' : 'is-static'
      }`}
      style={style}
    >
      {collapsible ? (
        <button
          type="button"
          className="xmd-demo-code-toggle"
          aria-expanded={open}
          onClick={() => setCollapsed((value) => !value)}
        >
          <span className="xmd-demo-code-chevron" aria-hidden />
          <span>{title}</span>
        </button>
      ) : null}
      {open ? (
        <div className="xmd-demo-code-body">
          <div className="xmd-demo-code-head">
            <div className="xmd-demo-code-files">
              {resolved.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  data-lang={f.lang ?? 'text'}
                  className={`xmd-demo-code-file ${i === index ? 'is-active' : ''}`}
                  onClick={() => setActiveName(f.name)}
                >
                  <span className="xmd-demo-code-file-icon" aria-hidden />
                  {f.name}
                </button>
              ))}
            </div>
            <span className="xmd-demo-code-lang">{file.lang ?? 'text'}</span>
            <button type="button" className="xmd-demo-code-copy" onClick={onCopy} aria-label={copyLabel}>
              <svg className="xmd-demo-code-copy-icon" viewBox="0 0 16 16" width="20" height="20" fill="none">
                <path
                  d="M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <span className="xmd-demo-code-copy-label">{copied ? '已复制' : copyLabel}</span>
            </button>
          </div>
          <Highlight
            {...defaultProps}
            theme={theme}
            code={file.code}
            language={(PRISM_LANG[file.lang ?? ''] ?? (file.lang as Language)) || ('text' as Language)}
          >
            {({ tokens, getLineProps, getTokenProps }) => (
              // Keep our own container styling (.xmd-demo-code pre); only the
              // token spans carry the github theme's inline colors, so we don't
              // depend on a globally-scoped prism stylesheet.
              <pre className={`language-${file.lang ?? 'text'}`}>
                <code>
                  {tokens.map((line, i) => {
                    const lineProps = getLineProps({ line, key: i });
                    return (
                      <span {...lineProps} key={i} style={{ ...lineProps.style, display: 'block' }}>
                        {line.map((token, key) => {
                          const tokenProps = getTokenProps({ token, key });
                          return <span {...tokenProps} key={key} />;
                        })}
                      </span>
                    );
                  })}
                </code>
              </pre>
            )}
          </Highlight>
        </div>
      ) : null}
    </div>
  );
};

export default DemoCode;
