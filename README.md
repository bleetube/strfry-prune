# strfry-prune

Selectively expire events from a [strfry](https://github.com/hoytech/strfry) database.

While `strfry` already includes its own delete method which takes an `--age` and/or `--filter` param, this tool facilitates granular control over what events are expunged.

## Usage

Simple example

```shell
strfry export | deno run --allow-read prune.ts > output.jsonl
cat /var/lib/strfry/metagross-01.jsonl | strfry import --no-verify
```

A more advanced example includes copying strfry.conf to pruning.conf and changing the database path. e.g. `db = "./temp-db/"`

```shell
doas -u strfry strfry export | doas -u strfry deno run --allow-read prune.ts  | doas -u strfry strfry --config pruning.conf import --no-verify
systemctl stop stfry
mv -v temp-db/data.mdb strfry-db/data.mdb
systemctl start stfry
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