import type { EditorMessage } from '@byterygon/onlyoffice-kit-types';

export class EditorMessageChannel {
  private channel: MessageChannel;
  private listeners = new Map<string, Set<(data: unknown) => void>>();

  constructor() {
    this.channel = new MessageChannel();
    this.channel.port1.onmessage = (event: MessageEvent<EditorMessage>) => {
      const { type, payload } = event.data;
      const handlers = this.listeners.get(type);
      if (handlers) {
        handlers.forEach((handler) => handler(payload));
      }
    };
  }

  get port(): MessagePort {
    return this.channel.port2;
  }

  on(type: string, handler: (data: unknown) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
  }

  off(type: string, handler: (data: unknown) => void): void {
    this.listeners.get(type)?.delete(handler);
  }

  send(message: EditorMessage): void {
    this.channel.port1.postMessage(message);
  }

  destroy(): void {
    this.channel.port1.close();
    this.channel.port2.close();
    this.listeners.clear();
  }
}
