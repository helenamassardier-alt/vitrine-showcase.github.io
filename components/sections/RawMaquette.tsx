// Renders a verbatim slice of the original maquette HTML inline.
//
// This is the pragmatic shortcut for the static (non-data-bound) sections
// during the migration: instead of hand-converting hundreds of lines of HTML
// to JSX (with all the className / htmlFor / self-closing / style-object
// gotchas), we read the source HTML at build time and inject it via
// dangerouslySetInnerHTML. Safe because the source is our own static markup,
// not user input. JSX-converting individual chunks later is a follow-up.
//
// Each chunk lives in static-content/{name}.html, extracted verbatim from
// public/index.html. To edit a chunk, edit the .html file directly.

import fs from "node:fs/promises";
import path from "node:path";

import pkg from "../../package.json";

const CHUNK_DIR = path.resolve(process.cwd(), "static-content");

export type ChunkName = "top" | "middle" | "bottom";

// `2.0.0-beta.0` → `Bêta v2.0.0`; `2.0.0` → `v2.0.0`.
// Pre-release tag (-beta.N) is internal; UI shows the word "Bêta" instead.
function formatVersion(version: string): string {
  const [core] = version.split("-");
  const isBeta = version.includes("-beta");
  return isBeta ? `Bêta v${core}` : `v${core}`;
}

export async function RawMaquette({ chunk }: { chunk: ChunkName }) {
  const file = path.join(CHUNK_DIR, `${chunk}.html`);
  const raw = await fs.readFile(file, "utf8");
  const html = raw.replaceAll("__VERSION__", formatVersion(pkg.version));
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
