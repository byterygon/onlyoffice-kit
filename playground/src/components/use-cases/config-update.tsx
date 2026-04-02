import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Controller,
  type OnlyOfficeConfig,
} from '@byterygon/onlyoffice-kit-core';

const DOCUMENT_SERVER_URL = 'http://localhost:8080/';

const FILE_TYPES = [
  { label: 'Word (.docx)', fileType: 'docx', documentType: 'word' as const },
  {
    label: 'Spreadsheet (.xlsx)',
    fileType: 'xlsx',
    documentType: 'cell' as const,
  },
  {
    label: 'Presentation (.pptx)',
    fileType: 'pptx',
    documentType: 'slide' as const,
  },
] as const;

export function ConfigUpdate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [activeType, setActiveType] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = useCallback((message: string) => {
    setLogs((current) => [message, ...current].slice(0, 8));
  }, []);

  const buildConfig = useCallback(
    (typeIndex: number): OnlyOfficeConfig => {
      const ft = FILE_TYPES[typeIndex];
      return {
        document: {
          fileType: ft.fileType,
          key: `demo-${ft.fileType}-key`,
          title: `Sample.${ft.fileType}`,
          url: `http://fileserver:80/sample.${ft.fileType}`,
        },
        documentType: ft.documentType,
        editorConfig: {
          callbackUrl: 'http://localhost:4200/callback',
          lang: 'en',
        },
        events: {
          onAppReady: () => appendLog(`[${ft.label}] onAppReady`),
          onDocumentReady: () => appendLog(`[${ft.label}] onDocumentReady`),
        },
        width: '100%',
        height: '100%',
        type: 'desktop',
      };
    },
    [appendLog],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const controller = new Controller({
      element: containerRef.current,
      config: buildConfig(0),
      documentServerUrl: DOCUMENT_SERVER_URL,
    });
    controllerRef.current = controller;
    appendLog('Controller initialized');

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [appendLog, buildConfig]);

  const switchType = (index: number) => {
    setActiveType(index);
    const config = buildConfig(index);
    controllerRef.current?.setConfig(config);
    appendLog(`Switched to ${FILE_TYPES[index].label}`);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-lg font-semibold">Config Update</h2>
        <p className="text-sm text-muted-foreground">
          Switch between document types to see how setConfig triggers editor
          recreation.
        </p>
      </div>
      <div className="flex gap-2">
        {FILE_TYPES.map((ft, index) => (
          <button
            key={ft.fileType}
            type="button"
            onClick={() => switchType(index)}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors ${
              activeType === index
                ? 'bg-primary text-primary-foreground'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {ft.label}
          </button>
        ))}
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
