declare module "bun:test" {
  type TestBody = () => void | Promise<void>;

  type Matchers = {
    toBe(expected: unknown): void;
    toBeGreaterThan(expected: number): void;
    toBeNull(): void;
    toContain(expected: string): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
  };

  export function describe(name: string, body: TestBody): void;
  export function expect(actual: unknown): Matchers;
  export function test(name: string, body: TestBody): void;
}
