#!/bin/bash
set -x
set -e

echo Beginning pruning task.

# prune
strfry export | deno run --allow-read prune.ts > /tmp/metagross-01.jsonl
cat /var/lib/strfry/metagross-01.jsonl | strfry import --no-verify

# compact
strfry compact strfry-db/compact.mdb
mv -v strfry-db/compact.mdb strfry-db/data.mdb

echo Pruning task completed.
