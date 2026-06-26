export type SemBlock = {
  id: string;
  type: "section" | "directive" | "braid" | "route" | "memory" | "tool" | "meta";
  header: string;
  body: string;
  tags: string[];
};

export function parseSemFile(content: string): SemBlock[] {
  const lines = content.split(/\r?\n/);
  const blocks: SemBlock[] = [];
  let current: SemBlock | null = null;

  const commit = () => {
    if (current) blocks.push(current);
    current = null;
  };

  for (const line of lines) {
    const headerMatch = line.match(/^##\s*(.+)$/);
    if (headerMatch) {
      commit();
      current = {
        id: headerMatch[1].toLowerCase().replace(/\s+/g, "_"),
        type: "section",
        header: headerMatch[1],
        body: "",
        tags: []
      };
      continue;
    }

    const directiveMatch = line.match(/^@(\w+):\s*(.+)$/);
    if (directiveMatch && current) {
      blocks.push({
        id: directiveMatch[1],
        type: "directive",
        header: directiveMatch[1],
        body: directiveMatch[2],
        tags: directiveMatch[2].split(/\s+/)
      });
      continue;
    }

    if (current) current.body += line + "\n";
  }

  commit();
  return blocks;
}
