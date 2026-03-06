import type { Timestamp } from "@/types/utility/scalars";

export async function waitMockDelay(baseMs: number = 140): Promise<void> {
  const jitter = Math.floor(Math.random() * 220);
  await new Promise<void>((resolve) => {
    setTimeout(resolve, baseMs + jitter);
  });
}

export function asTimestamp(value: string): Timestamp {
  return value as Timestamp;
}

export function nowTimestamp(): Timestamp {
  return new Date().toISOString() as Timestamp;
}

export function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
