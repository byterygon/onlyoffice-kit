let counter = 0;

export function uid(prefix = 'oo'): string {
  return `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
