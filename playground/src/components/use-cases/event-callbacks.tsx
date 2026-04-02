import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Controller,
  type OnlyOfficeConfig,
} from '@byterygon/onlyoffice-kit-core';

const DOCUMENT_SERVER_URL = 'http://localhost:8080/';

export function EventCallbacks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [callbackVersion, setCallbackVersion] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = useCallback((message: string) => {
    setLogs((current) => [message, ...current].slice(0, 20));
  }, []);

  const buildConfig = useCallback(
    (version: number): OnlyOfficeConfig => ({
      document: {
        fileType: 'docx',
        key: 'demo-events-key',
        title: 'Events Demo.docx',
        url: 'http://fileserver:80/sample.docx',
      },
      documentType: 'word',
      editorConfig: {
        callbackUrl: 'http://localhost:4200/callback',
        lang: 'en',
      },
      events: {
        onAppReady: () => appendLog(`[v${version}] onAppReady`),
        onDocumentReady: () => appendLog(`[v${version}] onDocumentReady`),
        onError: (event: { data: { errorDescription: string } }) =>
          appendLog(`[v${version}] onError: ${event.data.errorDescription}`),
        onWarning: (event: { data: { warningDescription: string } }) =>
          appendLog(
            `[v${version}] onWarning: ${event.data.warningDescription}`,
          ),
        onInfo: (event: { data: unknown }) =>
          appendLog(`[v${version}] onInfo: ${JSON.stringify(event.data)}`),
      },
      width: '100%',
      height: '100%',
      type: 'desktop',
    }),
    [appendLog],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const controller = new Controller({
      element: containerRef.current,
      config: buildConfig(1),
      documentServerUrl: DOCUMENT_SERVER_URL,
    });
    controllerRef.current = controller;
    appendLog('Controller initialized');

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [appendLog, buildConfig]);

  useEffect(() => {
    if (callbackVersion > 1) {
      controllerRef.current?.setConfig(buildConfig(callbackVersion));
    }
  }, [callbackVersion, buildConfig]);

  const rotateCallbacks = () => {
    setCallbackVersion((v) => v + 1);
    appendLog('Rotated event callbacks (no recreate expected)');
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-lg font-semibold">Event Callbacks</h2>
        <p className="text-sm text-muted-foreground">
          Test hot-swapping event callbacks without recreating the editor. Each
          version tags its log entries.
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={rotateCallbacks}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Rotate callbacks (v{callbackVersion})
        </button>
        <button
          type="button"
          onClick={clearLogs}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear logs
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 min-h-[480px] border rounded-md"
      />
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Event Log ({logs.length})
        </h3>
        <ul className="text-xs font-mono space-y-1 text-muted-foreground max-h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <li key={`${log}-${index}`}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
