# strfry-prune

Expire events from the strfry database.

## Usage

Expire events:

```shell
cat input.jsonl | deno run --allow-read main.ts -- > output.jsonl
```

Just print stats:

```shell
deno run --allow-read main.ts --file input.jsonl
```
