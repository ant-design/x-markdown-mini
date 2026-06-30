import React from 'react';

const INSTALL_COMMAND = 'npm i @ant-design/x-markdown-mini';

interface InstallPanelProps {
  copyLabel: string;
  copySuccessText: string;
  playgroundHref: string;
  playgroundLabel: string;
}

export default function InstallPanel({
  copyLabel,
  copySuccessText,
  playgroundHref,
  playgroundLabel,
}: InstallPanelProps) {
  return (
    <div className="xmd-hero-actions">
      <button
        type="button"
        className="xmd-install-command"
        data-xmd-copy={INSTALL_COMMAND}
        data-xmd-copy-success={copySuccessText}
        aria-label={copyLabel}
      >
        <span className="xmd-install-prompt" aria-hidden="true">
          $
        </span>
        <code>{INSTALL_COMMAND}</code>
        <span className="xmd-copy-control" aria-hidden="true">
          <svg className="xmd-copy-icon" viewBox="0 0 16 16" width="19" height="19" fill="none">
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
          <svg className="xmd-check-icon" viewBox="0 0 16 16" width="19" height="19" fill="none">
            <path
              d="m3 8.2 3 3L13 4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span data-xmd-copy-status />
        </span>
      </button>
      <a className="xmd-secondary-link xmd-playground-link" href={playgroundHref}>
        {playgroundLabel}
      </a>
    </div>
  );
}
