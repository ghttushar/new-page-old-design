let connected = false;

const listeners = new Set<(connected: boolean) => void>();

export function getMcpConnected(): boolean {
  return connected;
}

export function setMcpConnected(value: boolean): void {
  connected = value;
  listeners.forEach((listener) => listener(value));
}

export function subscribeMcpConnected(
  listener: (connected: boolean) => void
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}