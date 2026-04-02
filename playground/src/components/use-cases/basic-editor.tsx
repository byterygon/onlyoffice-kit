import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Controller,
  type OnlyOfficeConfig,
} from '@byterygon/onlyoffice-kit-core';

const DOCUMENT_SERVER_URL = 'http://localhost:8080/';
const INITIAL_CALLBACK_VERSION = 1;
const INITIAL_DOCUMENT_TITLE = 'Example Document Title.docx';

function createConfig(
  title: string,
  callbackVersion: number,
  appendLog: (message: string) => void,
): OnlyOfficeConfig {
  return {
    document: {
      fileType: 'docx',
      key: 'demo-doc-key',
      title,
      url: 'http://fileserver:80/sample.docx',
    },
    documentType: 'word',
    editorConfig: {
      callbackUrl: 'http://localhost:4200/callback',
      lang: 'en',
    },
    events: {
      onAppReady: () => {
        appendLog(`onAppReady handled by callback v${callbackVersion}`);
      },
      onDocumentReady: () => {
        appendLog(`onDocumentReady handled by callback v${callbackVersion}`);
      },
      onError: (event: { data: { errorDescription: string } }) => {
        appendLog(
          `onError v${callbackVersion}: ${event.data.errorDescription}`,
        );
      },
      onWarning: (event: { data: { warningDescription: string } }) => {
        appendLog(
          `onWarning v${callbackVersion}: ${event.data.warningDescription}`,
        );
      },
    },
    width: '100%',
    height: '100%',
    type: 'desktop',
  };
}

export function BasicEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [callbackVersion, setCallbackVersion] = useState(
    INITIAL_CALLBACK_VERSION,
  );
  const [documentTitle, setDocumentTitle] = useState(INITIAL_DOCUMENT_TITLE);
  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = useCallback((message: string) => {
    setLogs((current) => [message, ...current].slice(0, 8));
  }, []);

  const config = useMemo(
    () => createConfig(documentTitle, callbackVersion, appendLog),
    [appendLog, callbackVersion, documentTitle],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const initialConfig = createConfig(
      INITIAL_DOCUMENT_TITLE,
      INITIAL_CALLBACK_VERSION,
      appendLog,
    );
    const controller = new Controller({
      element: containerRef.current,
      config: initialConfig,
      documentServerUrl: DOCUMENT_SERVER_URL,
    });
    controllerRef.current = controller;
    appendLog('Controller initialized');

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [appendLog]);

  useEffect(() => {
    controllerRef.current?.setConfig(config);
  }, [config]);

  const rotateCallbacks = (): void => {
    setCallbackVersion((value) => value + 1);
    appendLog('Updated events callbacks with setConfig (no recreate expected)');
  };

  const toggleCoreConfig = (): void => {
    setDocumentTitle((current) =>
      current.endsWith('(updated)')
        ? 'Example Document Title.docx'
        : 'Example Document Title (updated)',
    );
    appendLog('Updated document title with setConfig (recreate expected)');
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-lg font-semibold">Basic Editor</h2>
        <p className="text-sm text-muted-foreground">
          Controller boots the web component and sends config through
          MessageChannel.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={rotateCallbacks}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          Update callbacks only
        </button>
        <button
          type="button"
          onClick={toggleCoreConfig}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          Update core config
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 min-h-[480px] border rounded-md"
      />
      <div>
        <h3 className="text-sm font-semibold mb-2">Logs</h3>
        <ul className="text-xs font-mono space-y-1 text-muted-foreground">
          {logs.map((log, index) => (
            <li key={`${log}-${index}`}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
