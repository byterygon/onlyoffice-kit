import { useEffect, useRef } from 'react';
import {
  Controller,
  type ControllerOptions,
} from '@byterygon/onlyoffice-kit-core';

export type UseEditorOptions = Omit<ControllerOptions, 'element'>;

export function useEditor(options: UseEditorOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const controller = new Controller({
      ...options,
      element: containerRef.current,
    });
    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  return { containerRef, controller: controllerRef };
}
