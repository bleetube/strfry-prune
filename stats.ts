import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

const decoder = new TextDecoder();

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

const printStats = (eventCount: EventCount): void => {
  console.log("Event counts:");

  Object.entries(eventCount)
    .sort(([, a], [, b]) => b - a) // sort by value
    .forEach(([kind, count]) => {
      console.log(`${kind}: ${count}`);
    });
};

const filePath = Deno.args[0];
const results = await countEventsFile(filePath);
printStats(results);