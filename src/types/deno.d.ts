/**
 * Type declarations for Deno APIs used in tests
 */
declare namespace Deno {
  /**
   * Registers a test which will be run when deno test is used to run tests.
   */
  // Avoid conflict with the built-in test from lib.deno.ns.d.ts
  // function test(name: string, fn: () => void | Promise<void>): void;
}
