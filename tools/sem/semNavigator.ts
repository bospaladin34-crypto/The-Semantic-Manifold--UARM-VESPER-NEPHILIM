import { SemBlock } from "./semReader";

export class SemNavigator {
  constructor(private blocks: SemBlock[]) {}

  findByTag(tag: string): SemBlock[] {
    return this.blocks.filter(b => b.tags.includes(tag));
  }

  findSections(): SemBlock[] {
    return this.blocks.filter(b => b.type === "section");
  }

  findDirectives(): SemBlock[] {
    return this.blocks.filter(b => b.type === "directive");
  }

  search(text: string): SemBlock[] {
    const q = text.toLowerCase();
    return this.blocks.filter(
      b => b.header.toLowerCase().includes(q) || b.body.toLowerCase().includes(q)
    );
  }

  toPatches() {
    return this.blocks.map(b => ({
      patchId: `sem_${b.id}`,
      center: { x: 0, y: 0, z: 0 },
      tangram: b.tags.map(t => ({ id: t, symbol: t, weight: 1 })),
      fibers: { text: b.body },
      provenance: { type: b.type, header: b.header }
    }));
  }
}
