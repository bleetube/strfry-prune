# strfry-prune

Expire events from the strfry database.

## Usage

Expire events:

```shell
cat input.jsonl | deno run --allow-read prune.ts > output.jsonl
```

Just print stats:

```shell
deno run --allow-read=. stats.ts --input input.jsonl
```

## notes

Inspect kinds arbitrarily:

```shell
grep '"kind":0' input.jsonl | jq
```