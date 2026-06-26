// ZWPL caching layer for ultra‑low token usage

import { ZWPLPacket } from "./zwplCompiler";
import { BraidWord } from "./zwplToBraid";

type CacheKey = string;

export type ZWPLCacheEntry = {
  packet: ZWPLPacket;
  braid: BraidWord;
  timestamp: number;
};

export class ZWPLCache {
  private store = new Map<CacheKey, ZWPLCacheEntry>();
  constructor(private ttlMs: number = 5 * 60 * 1000) {}

  private makeKey(input: string): CacheKey {
    return input.trim().toLowerCase();
  }

  get(input: string): ZWPLCacheEntry | undefined {
    const key = this.makeKey(input);
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.store.delete(key);
      return undefined;
    }
    return entry;
  }

  set(input: string, packet: ZWPLPacket, braid: BraidWord): void {
    const key = this.makeKey(input);
    this.store.set(key, {
      packet,
      braid,
      timestamp: Date.now(),
    });
  }
}
