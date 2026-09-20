import { readdir, readFile } from "node:fs/promises";

const skillsRoot = new URL("../skills/", import.meta.url);
const expectedSkills = new Set([
  "analyze-metrics",
  "audit-instrumentation",
  "build-dashboard",
  "funnel-doctor",
  "instrument-my-app",
  "retention-cohorts",
  "run-experiment",
  "weekly-review",
]);

// Keep this list aligned with the customer MCP registrations. Being explicit
// prevents a skill from silently documenting an invented tool.
const customerMcpTools = new Set([
  "mgm_whoami", "mgm_list_projects", "mgm_create_project", "mgm_get_dashboard",
  "mgm_get_filters", "mgm_list_events", "mgm_list_event_types", "mgm_define_event",
  "mgm_list_funnels", "mgm_get_funnel", "mgm_create_funnel", "mgm_update_funnel",
  "mgm_delete_funnel", "mgm_execute_funnel", "mgm_list_retentions", "mgm_get_retention",
  "mgm_create_retention", "mgm_update_retention", "mgm_delete_retention",
  "mgm_execute_retention", "mgm_list_queries", "mgm_get_query", "mgm_create_query",
  "mgm_update_query", "mgm_delete_query", "mgm_execute_query", "mgm_list_experiments",
  "mgm_get_experiment", "mgm_create_experiment", "mgm_update_experiment",
  "mgm_delete_experiment", "mgm_start_experiment", "mgm_stop_experiment",
  "mgm_list_widgets", "mgm_add_widget", "mgm_remove_widget", "mgm_reset_widgets",
  "mgm_create_api_key",
]);

const entries = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const errors = [];
if (entries.length !== expectedSkills.size || entries.some((name) => !expectedSkills.has(name))) {
  errors.push(`Expected skills: ${[...expectedSkills].sort().join(", ")}; found: ${entries.join(", ")}`);
}

for (const directory of entries) {
  const source = await readFile(new URL(`${directory}/SKILL.md`, skillsRoot), "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
  const declaredName = frontmatter?.[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter?.[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();

  if (declaredName !== directory) errors.push(`${directory}: frontmatter name is ${declaredName ?? "missing"}`);
  if (!description) errors.push(`${directory}: frontmatter description is missing`);

  const references = [...source.matchAll(/`(mgm_[a-z_]+)(?:\s|`)/g)].map((match) => match[1]);
  for (const tool of new Set(references)) {
    if (!customerMcpTools.has(tool)) errors.push(`${directory}: unknown customer MCP tool ${tool}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${entries.length} skills and their customer MCP references.`);
}
