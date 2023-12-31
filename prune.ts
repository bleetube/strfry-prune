import { readLines } from 'https://deno.land/std@0.201.0/io/mod.ts';

const kindAgeLimitDefault = 90;
const kindAgeLimits: Record<number, number> = {
  0: 365,     // Profiles
  3: 365,      // Contacts
  9734: 365,  // Zap Requests
  9735: 365,  // Zap Receipts
  24133: 365, // NWC
  10002: 730, // NIP-65
};

const exportEventsStdin = async (): Promise<void> => {
  if (Deno.isatty(Deno.stdin.rid)) {
    Deno.exit(1);
  }
  for await (const line of readLines(Deno.stdin)) {
    if (line.length === 0) {
      return;
    }
    exportLine(line);
  }
};

const exportLine = (line: string): void => {
  const eventJson = JSON.parse(line);
  const kind = eventJson.kind;
  const created_at = new Date(eventJson.created_at * 1000); // convert seconds to ms
  const kindAgeLimit = (kindAgeLimits[kind] || kindAgeLimitDefault) * 24 * 60 * 60 * 1000; // convert days to ms
  const ageLimitDate = new Date(Date.now() - kindAgeLimit);
  if (created_at > ageLimitDate) {
    console.log(line);
  }
};

await exportEventsStdin();