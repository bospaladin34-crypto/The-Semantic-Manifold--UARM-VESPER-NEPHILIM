// ZWPL → BraidC translator

import { ZWPLPacket } from "./zwplCompiler";

export type BraidDirection = "forward" | "inverse";

export type BraidGenerator = {
  strand: number;
  direction: BraidDirection;
  op?: "TWIST" | "COLLAPSE" | "ROUTE";
};

export type BraidWord = {
  generators: BraidGenerator[];
};

export function translateZWPLToBraid(packet: ZWPLPacket): BraidWord {
  const gens: BraidGenerator[] = [];

  // base by intent
  switch (packet.intent) {
    case "analyze":
      gens.push({ strand: 1, direction: "forward" });
      gens.push({ strand: 1, direction: "forward", op: "COLLAPSE" });
      break;
    case "transform":
      gens.push({ strand: 1, direction: "forward" });
      gens.push({ strand: 2, direction: "forward", op: "TWIST" });
      break;
    case "generate":
      gens.push({ strand: 1, direction: "forward", op: "TWIST" });
      gens.push({ strand: 2, direction: "forward", op: "TWIST" });
      break;
    case "compress":
      gens.push({ strand: 1, direction: "inverse" });
      gens.push({ strand: 1, direction: "forward", op: "COLLAPSE" });
      break;
    case "route":
      gens.push({ strand: 1, direction: "forward", op: "ROUTE" });
      break;
  }

  // mode modifiers
  if (packet.mode === "reductive") {
    gens.push({ strand: 1, direction: "inverse" });
  } else if (packet.mode === "convergent") {
    gens.push({ strand: 2, direction: "inverse", op: "COLLAPSE" });
  } else if (packet.mode === "exploratory") {
    gens.push({ strand: 3, direction: "forward", op: "TWIST" });
  }

  // depth scaling
  while (gens.length < packet.constraints.depth) {
    gens.push({
      strand: gens.length + 1,
      direction: "forward",
    });
  }

  return { generators: gens };
}
