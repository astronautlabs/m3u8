# @/m3u8

[![npm](https://img.shields.io/npm/v/@astronautlabs/m3u8)](https://npmjs.com/package/@astronautlabs/m3u8)
[![CircleCI](https://circleci.com/gh/astronautlabs/m3u8.svg?style=svg)](https://circleci.com/gh/astronautlabs/m3u8)

> **[📜 M3U8 Playlists](https://en.wikipedia.org/wiki/M3U)**  
> Or _Moving Picture Experts Group Audio Layer 3 Uniform Resource Locator_ 😀

> 📺 Part of the [**Astronaut Labs Broadcast Suite**](https://github.com/astronautlabs/broadcast)  

> ✅ **Release Quality**  
> This library is ready for production

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