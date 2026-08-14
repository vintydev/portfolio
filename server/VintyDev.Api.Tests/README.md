# VintyDev.Api.Tests

Integration tests that exercise real dependencies (currently: Azure Storage
Queues) rather than mocking them — specifically to catch contract mismatches
between the API and the Contact Function that a mock would hide.

## Prerequisites

Requires [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite),
the local Azure Storage emulator. With Docker:

```bash
docker run -d --name azurite \
  -p 10000:10000 -p 10001:10001 -p 10002:10002 \
  mcr.microsoft.com/azure-storage/azurite \
  azurite --skipApiVersionCheck --blobHost 0.0.0.0 --queueHost 0.0.0.0 --tableHost 0.0.0.0
```

`--skipApiVersionCheck` is required — the installed `Azure.Storage.Queues`
SDK sends a newer API version than Azurite checks by default, and the run
fails with a 400 `InvalidHeaderValue` without this flag.

Leave it running in the background; the tests connect to it via the
well-known `UseDevelopmentStorage=true` connection string (Azurite's fixed
local dev account — not a secret, safe to have in test code).

## Running

```bash
dotnet test server/VintyDev.Api.Tests/VintyDev.Api.Tests.csproj
```

## CI

Runs automatically on every push and pull request touching `server/**`
(excluding the Function project) via
[`.github/workflows/test-api.yml`](../../.github/workflows/test-api.yml),
which starts Azurite the same way as above before running the suite.

## Why this exists

`AzureQueueContactSenderTests` is a regression guard for a real incident:
the API enqueued contact messages as plain UTF-8 text, while the Contact
Function's queue trigger (`host.json`, `MessageEncoding: Base64`) expected
Base64. Every message failed silently — no exception in either project,
nothing in Application Insights, just messages dequeued, retried five times,
and quietly moved to the poison queue. It was only found by watching the
Function's raw log stream live.

The test asserts what actually ends up on the wire, not just that our own
code runs without throwing — that's the only way to catch this class of bug,
since the two sides are independently deployed and never share a compiler.

Stop Azurite when done: `docker stop azurite && docker rm azurite`.
