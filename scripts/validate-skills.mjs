import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const skillsRoot = path.join(root, "skills");
const readme = await readFile(path.join(root, "README.md"), "utf8");
const entries = (await readdir(skillsRoot)).sort();
const errors = [];

for (const entry of entries) {
  const directory = path.join(skillsRoot, entry);
  if (!(await stat(directory)).isDirectory()) continue;

  const skillPath = path.join(directory, "SKILL.md");
  let content;

  try {
    content = await readFile(skillPath, "utf8");
  } catch {
    errors.push(`${entry}: missing SKILL.md`);
    continue;
  }

  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    errors.push(`${entry}: missing YAML frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();

  if (name !== entry) errors.push(`${entry}: frontmatter name is ${name ?? "missing"}`);
  if (!description) errors.push(`${entry}: missing frontmatter description`);
  if (!readme.includes(`\`${entry}\``)) errors.push(`${entry}: missing from README skill list`);
  if (content.includes("TODO") || content.includes("<replace")) {
    errors.push(`${entry}: contains unfinished scaffold text`);
  }
}

for (const file of ["AGENTS.md", "CLAUDE.md", "README.md"]) {
  try {
    await stat(path.join(root, file));
  } catch {
    errors.push(`missing repository entry point: ${file}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`Validated ${entries.length} portable MGM skills`);
