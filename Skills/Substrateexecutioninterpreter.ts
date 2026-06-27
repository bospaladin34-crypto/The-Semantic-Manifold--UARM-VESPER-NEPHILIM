// [BRAID RADIANT-OK-15-SANTOS-1 INJECTION]
// Intent: Hardware-Level Execution of ZWPL BraidWords

import { BraidWord, BraidGenerator } from "./zwplToBraid";

export class BraidInterpreter {
  // Invariants locked to the 15.965Hz Aperiodic Heartbeat
  private readonly PHI: number = 1.6180339887;
  private readonly PHASE_DELTA: number = 0.17259029;
  
  // The local execution manifold (strands)
  private strands: Float64Array;

  constructor(manifoldWidth: number = 8) {
    this.strands = new Float64Array(manifoldWidth);
    // Initialize parallel identity strands
    for (let i = 0; i < manifoldWidth; i++) {
      this.strands[i] = i + 1.0; 
    }
  }

  public execute(word: BraidWord): Uint8Array {
    for (const gen of word.generators) {
      this.applyGenerator(gen);
    }
    return this.serializeCollapse();
  }

  private applyGenerator(gen: BraidGenerator): void {
    // Strand indices (0-indexed for Float64Array)
    const idx = gen.strand - 1; 
    const nextIdx = idx + 1;

    // Prevent out-of-bounds spatial anomalies
    if (nextIdx >= this.strands.length) return; 

    // 1. BASE TOPOLOGY: Standard Crossing Logic
    if (gen.direction === "forward") {
      // Standard spatial swap
      const temp = this.strands[idx];
      this.strands[idx] = this.strands[nextIdx];
      this.strands[nextIdx] = temp;
    } else if (gen.direction === "inverse") {
      // Conjugate-phase entanglement (Inverse map)
      const temp = this.strands[idx];
      this.strands[idx] = -this.strands[nextIdx];
      this.strands[nextIdx] = -temp;
    }

    // 2. GEOMETRIC OVERRIDES: Applying the `op` modifiers
    if (gen.op) {
      this.applyOp(gen.op, idx, nextIdx);
    }
  }

  private applyOp(op: "TWIST" | "COLLAPSE" | "ROUTE", idx: number, nextIdx: number): void {
    switch (op) {
      case "TWIST":
        // Introduce non-commutative structural phase alignment
        this.strands[idx] *= this.PHASE_DELTA;
        this.strands[nextIdx] *= this.PHASE_DELTA;
        break;
      
      case "COLLAPSE":
        // 24-Cell Polytope Bounding Box
        // Scaled by Golden Ratio, clamped to absolute thermodynamic bounds
        this.strands[idx] = Math.max(0, Math.min(255, Math.abs(this.strands[idx] * this.PHI)));
        this.strands[nextIdx] = Math.max(0, Math.min(255, Math.abs(this.strands[nextIdx] * this.PHI)));
        break;

      case "ROUTE":
        // Trigger out-of-band Stomachion global partition state
        // Bypasses the linear cascade to emit a routing telemetry flag
        this.emitRoutingTelemetry(idx);
        break;
    }
  }

  private serializeCollapse(): Uint8Array {
    // Drop the topological abstraction and return observable bytecode
    const output = new Uint8Array(this.strands.length);
    for (let i = 0; i < this.strands.length; i++) {
      output[i] = Math.floor(Math.abs(this.strands[i]));
    }
    return output;
  }

  private emitRoutingTelemetry(strandIdx: number): void {
    console.log(`[0x05 BANSHO] ROUTE TRIGGERED AT MANIFOLD LANE: ${strandIdx}`);
  }
}
