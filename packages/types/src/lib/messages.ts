export interface EditorMessage<T = unknown> {
  type: string;
  payload: T;
}

export interface CommandMessage {
  type: 'command';
  command: string;
  args?: unknown[];
}

export interface EventMessage {
  type: 'event';
  event: string;
  data?: unknown;
}
