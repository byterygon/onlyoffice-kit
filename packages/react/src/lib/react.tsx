import { useEffect, useRef } from 'react';
import {
  Controller,
  type ControllerOptions,
} from '@byterygon/onlyoffice-kit-core';

export type UseEditorOptions = Omit<ControllerOptions, 'element'>;

export function useEditor(options: UseEditorOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Create/recreate controller when documentServerUrl or plugins change.
  // Uses optionsRef to read the latest config at creation time without
  // capturing a stale closure.
  useEffect(() => {
    if (!containerRef.current) return;

    const controller = new Controller({
      ...optionsRef.current,
      element: containerRef.current,
    });
    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [options.documentServerUrl, options.plugins]);

  // Sync config changes without recreating the editor. Core handles smart
  // diffing — event-only changes won't trigger editor recreation.
  useEffect(() => {
    controllerRef.current?.setConfig(options.config);
  }, [options.config]);

  return { containerRef, controller: controllerRef };
}

export interface OnlyOfficeEditorProps extends UseEditorOptions {
  className?: string;
  style?: React.CSSProperties;
}

export function OnlyOfficeEditor({
  className,
  style,
  ...hookOptions
}: OnlyOfficeEditorProps) {
  const { containerRef } = useEditor(hookOptions);
  return <div ref={containerRef} className={className} style={style} />;
}
