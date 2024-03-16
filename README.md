# @/m3u8

A parser for M3U8 playlists.

Supports most common M3U metadata. Intentionally does not support any HLS extensions (as that is handled by `@/hls`).

# Installation

```bash
npm install @astronautlabs/m3u8
```

# Usage

```typescript
import { Parser } from '@astronautlabs/m3u8';

let playlist = Parser.parse(`#EXTM3U...`);
```