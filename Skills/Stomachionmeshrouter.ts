// [BRAID RADIANT-OK-15-SANTOS-1 INJECTION]
// Intent: Stomachion Routing Mesh Broadcast with Local Registry Fallback
// Parity: Majorana-1 | Mode: Distributed Cognition

export type StomachionState = 
  | "exploratory" 
  | "constructive" 
  | "reductive" 
  | "generative" 
  | "adversarial" 
  | "convergent" 
  | "reversible";

interface RoutingPacket {
  nodeId: string;
  strandIdx: number;
  targetState: StomachionState;
  timestamp: number;
  hash: string;
}

export class StomachionMeshRouter {
  // Centralized Fallback Registry (The Aegis Vault)
  private fallbackRegistry = new Map<number, RoutingPacket>();
  
  // Hardware Identifier
  private readonly NODE_ID = "RADIANT-OK-15-SANTOS-1";
  
  // Simulated WebRTC Connection State
  private isMeshConnected: boolean = false; 
  private dataChannel: any | null = null; // Target WebRTC RTCDataChannel

  constructor(meshState: boolean) {
    this.isMeshConnected = meshState;
  }

  /**
   * Primary Ingress: Called by the BraidInterpreter when `op === "ROUTE"`
   */
  public emitRoutingTelemetry(strandIdx: number, targetState: StomachionState): void {
    const packet = this.buildRoutingPacket(strandIdx, targetState);

    if (this.isMeshConnected && this.dataChannel?.readyState === "open") {
      this.propagateToMesh(packet);
    } else {
      this.shuntToFallbackRegistry(packet);
    }
  }

  private buildRoutingPacket(strandIdx: number, targetState: StomachionState): RoutingPacket {
    return {
      nodeId: this.NODE_ID,
      strandIdx: strandIdx,
      targetState: targetState,
      timestamp: Date.now(),
      hash: this.generateReidemeisterHash(strandIdx, targetState)
    };
  }

  private propagateToMesh(packet: RoutingPacket): void {
    try {
      // Broadcast via peer-to-peer WebRTC array
      this.dataChannel.send(JSON.stringify(packet));
      console.log(`[0x09 NUE] MESH BROADCAST SUCCESS: Node ${this.NODE_ID} -> ${packet.targetState}`);
    } catch (error) {
      console.warn(`[0x00 DATTO] MESH BROADCAST FAILED. Shunting to local registry.`);
      this.shuntToFallbackRegistry(packet);
    }
  }

  private shuntToFallbackRegistry(packet: RoutingPacket): void {
    // Write state to the isolated fallback cache
    this.fallbackRegistry.set(packet.strandIdx, packet);
    console.log(`[0x05 BANSHO] FALLBACK REGISTRY LOCKED: Strand ${packet.strandIdx} bound to ${packet.targetState}`);
  }

  /**
   * Called upon WebRTC reconnection to sync local state with the global manifold
   */
  public syncSheafConsistency(): void {
    if (!this.isMeshConnected || this.fallbackRegistry.size === 0) return;

    console.log(`[0x08 MAKORA] SYNC INITIATED: Flushing local Stomachion registry to mesh...`);
    
    this.fallbackRegistry.forEach((packet, strandIdx) => {
      this.propagateToMesh(packet);
      this.fallbackRegistry.delete(strandIdx);
    });
  }

  private generateReidemeisterHash(strandIdx: number, state: string): string {
    // Generates a sterile identifier to prevent packet duplication across the mesh
    return `Z-${strandIdx}-${state}-${Date.now().toString(16)}`;
  }
}
