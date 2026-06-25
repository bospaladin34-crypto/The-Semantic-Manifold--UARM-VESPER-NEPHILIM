// ─────────────────────────────────────────────────────────────
// ACT‑Ω Zero‑Waste Prompting Layer (ZWPL) Compiler
// Converts raw user input → canonical ZWPL packet
// Deterministic, minimal, manifold‑native
// ─────────────────────────────────────────────────────────────

export type ZWPLIntent =
  | "transform"
  | "generate"
  | "analyze"
  | "route"
  | "compress";

export type ZWPLMode =
  | "constructive"
  | "reductive"
  | "convergent"
  | "exploratory";

export type ZWPLPacket = {
  intent: ZWPLIntent;
  mode: ZWPLMode;
  braid: string;
  patchContext: string[];
  constraints: {
    depth: number;
    style?: "minimal" | "verbose";
    format: "json" | "text" | "graph";
  };
  payload: string;
};

// ─────────────────────────────────────────────────────────────
// 1. Intent Classifier
// ─────────────────────────────────────────────────────────────

function classifyIntent(input: string): ZWPLIntent {
  const s = input.toLowerCase();

  if (s.includes("explain") || s.includes("analyze") || s.includes("why"))
    return "analyze";

  if (s.includes("rewrite") || s.includes("refactor") || s.includes("change"))
    return "transform";

  if (s.includes("create") || s.includes("design") || s.includes("generate"))
    return "generate";

  if (s.includes("route") || s.includes("choose") || s.includes("decide"))
    return "route";

  if (s.includes("summarize") || s.includes("compress") || s.includes("shorten"))
    return "compress";

  return "analyze"; // default safe fallback
}

// ─────────────────────────────────────────────────────────────
// 2. Mode Selector
// ─────────────────────────────────────────────────────────────

function selectMode(intent: ZWPLIntent): ZWPLMode {
  switch (intent) {
    case "transform":
      return "constructive";
    case "compress":
      return "reductive";
    case "route":
      return "convergent";
    case "generate":
      return "exploratory";
    default:
      return "constructive";
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Patch Resolver (domain → patchContext)
// Replace with your domain map as needed
// ─────────────────────────────────────────────────────────────

function resolvePatches(input: string): string[] {
  const s = input.toLowerCase();

  if (s.includes("interpreter")) return ["p_interpreter"];
  if (s.includes("braid")) return ["p_braid"];
  if (s.includes("patch") || s.includes("merge")) return ["p_merge"];
  if (s.includes("manifold")) return ["p_manifold"];
  if (s.includes("routing")) return ["p_route"];

  return ["p_general"];
}

// ─────────────────────────────────────────────────────────────
// 4. Constraint Inference
// ─────────────────────────────────────────────────────────────

function inferDepth(input: string): number {
  const len = input.length;

  if (len < 40) return 1;
  if (len < 120) return 2;
  if (len < 300) return 3;

  return 4;
}

function inferFormat(input: string): "json" | "text" | "graph" {
  if (input.includes("{") || input.includes("}")) return "json";
  if (input.includes("graph") || input.includes("visual")) return "graph";
  return "text";
}

// ─────────────────────────────────────────────────────────────
// 5. Payload Compressor
// Extracts the semantic core of the request
// ─────────────────────────────────────────────────────────────

function compressPayload(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_ ]/g, "")
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 4)
    .join("_");
}

// ─────────────────────────────────────────────────────────────
// 6. Braid Pattern Generator (ZWPL → BraidC seed)
// ─────────────────────────────────────────────────────────────

function generateBraid(intent: ZWPLIntent, mode: ZWPLMode): string {
  const base =
    intent === "analyze"
      ? "σ1 COLLAPSE"
      : intent === "transform"
      ? "σ1 σ2 TWIST"
      : intent === "generate"
      ? "σ1 TWIST σ2 TWIST"
      : intent === "compress"
      ? "σ1⁻¹ COLLAPSE"
      : "ROUTE";

  const mod =
    mode === "reductive"
      ? " σ1⁻¹"
      : mode === "convergent"
      ? " COLLAPSE"
      : mode === "exploratory"
      ? " TWIST"
      : "";

  return `${base}${mod}`;
}

// ─────────────────────────────────────────────────────────────
// 7. Compiler Entry Point
// ─────────────────────────────────────────────────────────────

export function compileZWPL(input: string): ZWPLPacket {
  const intent = classifyIntent(input);
  const mode = selectMode(intent);
  const patchContext = resolvePatches(input);

  return {
    intent,
    mode,
    braid: generateBraid(intent, mode),
    patchContext,
    constraints: {
      depth: inferDepth(input),
      style: "minimal",
      format: inferFormat(input),
    },
    payload: compressPayload(input),
  };
        }
