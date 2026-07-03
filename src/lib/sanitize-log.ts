/**
 * Sanitizes untrusted values before they are written to logs.
 *
 * Strips newlines and other control characters so a value coming from
 * user input, env vars, or CLI args cannot forge extra log lines or
 * terminal escape sequences (log injection).
 */
export function sanitizeForLog(value: unknown, maxLength = 200): string {
  let text: string;
  if (value instanceof Error) {
    text = value.message;
  } else if (typeof value === "string") {
    text = value;
  } else {
    // Serialization of untrusted input must never break logging itself
    // (e.g. circular references or BigInt make JSON.stringify throw).
    try {
      text = JSON.stringify(value) ?? String(value);
    } catch {
      text = "[unserializable]";
    }
  }

  // Collapse CR/LF, tabs, C0/C1 control chars, DEL, and Unicode line/paragraph
  // separators so an untrusted value cannot forge extra log lines or inject
  // terminal escape sequences.
  // deno-lint-ignore no-control-regex
  const stripped = text.replace(/[\r\n\t\x00-\x1f\x7f-\x9f\u2028\u2029]+/g, " ")
    .trim();

  return stripped.length > maxLength
    ? `${stripped.slice(0, maxLength)}…`
    : stripped;
}
