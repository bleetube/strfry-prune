import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

const decoder = new TextDecoder();
const preserveKind = [0, 10002];
const kindAgeLimitDefault = 7;
const kindAgeLimits = {
  0: 365,
  1: 90,
  3: 365,
  9734: 90,
  9735: 90,
  10002: 365,
};

interface EventCount {
  [kind: number]: number;
}

const countEventsFile = async (filePath: string): Promise<EventCount> => {
  const eventCount: EventCount = {};
  const fileInfo = await Deno.lstat(filePath);
  if (!fileInfo.isFile) {
    throw new Error("Provided path is not a file");
  }
  const f = await Deno.open(filePath);
  for await (const line of readline(f)) {
    if (line.length === 0) {
      continue;
    }
    const eventJson = JSON.parse(decoder.decode(line));
    const kind = eventJson.kind;
    if (typeof eventCount[kind] === "undefined") {
      eventCount[kind] = 1;
    } else {
      eventCount[kind]++;
    }
  }
  f.close();
  return eventCount;
};

const exportEventsStdin = async (): Promise<void> => {
  if (!Deno.isatty(Deno.stdin.rid)) {
    for await (const line of readline(Deno.stdin)) {
      await exportLine(line);
    }
  } else {
    console.error("No input detected. See documentation for usage.");
  }
};

const exportLine = async (line: Uint8Array): Promise<void> => {
    if (line.length === 0) {
      return;
    }
    const eventJson = JSON.parse(decoder.decode(line));
    const kind = eventJson.kind;
    if (preserveKind.includes(kind)) {
      await Deno.stdout.write(line);
    }
};

const printStats = (eventCount: EventCount): void => {
  console.log("Event counts:");

  Object.entries(eventCount)
    .sort(([, a], [, b]) => b - a) // sort by value
    .forEach(([kind, count]) => {
      console.log(`${kind}: ${count}`);
    });
};

const args = Deno.args;
if (args.includes("--")) {
  await exportEventsStdin();
} else if (args.includes("--file")) {
  const filePathIndex = args.indexOf("--file") + 1;
  const filePath = args[filePathIndex];
  const results = await countEventsFile(filePath);
  printStats(results);
} else {
  console.log("See documentation for usage.");
}