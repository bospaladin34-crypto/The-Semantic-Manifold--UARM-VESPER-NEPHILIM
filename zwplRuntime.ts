// ZWPL runtime integration for ACT‑Ω orchestrator

import { compileZWPL, ZWPLPacket } from "./zwplCompiler";
import { translateZWPLToBraid, BraidWord } from "./zwplToBraid";
import { State, EvalConfig, run as runBraid } from "./interpreter"; // your ACT‑Ω interpreter

export type ZWPLRuntimeConfig = {
  defaultDepth: number;
  defaultFormat: "json" | "text" | "graph";
};

export class ZWPLRuntime {
  constructor(private config: ZWPLRuntimeConfig) {}

  compile(input: string): ZWPLPacket {
    const packet = compileZWPL(input);
    return {
      ...packet,
      constraints: {
        ...packet.constraints,
        depth: packet.constraints.depth || this.config.defaultDepth,
        format: packet.constraints.format || this.config.defaultFormat,
      },
    };
  }

  toBraid(packet: ZWPLPacket): BraidWord {
    return translateZWPLToBraid(packet);
  }

  execute(input: string, state: State, evalConfig: EvalConfig): State {
    const packet = this.compile(input);
    const braid = this.toBraid(packet);
    return runBraid(braid, state, evalConfig);
  }
}
