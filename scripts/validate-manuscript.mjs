#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const chapterFiles = [
  "01-historical-roots-of-slavery.md",
  "02-philosophical-transformations-of-liberty.md",
  "03-work-value-economic-dependence.md",
  "04-structural-transformations-of-economy.md",
  "05-debt-credit-financial-dependence.md",
  "06-consumption-poverty-and-economic-exclusion.md",
  "07-class-stratification-and-inequality.md",
  "08-power-domination-political-control.md",
  "09-law-institutions-protection-restraint.md",
  "10-control-of-mind-and-consciousness.md",
  "11-media-culture-public-opinion.md",
  "12-identity-alienation-social-conformity.md",
  "13-data-economy-and-privacy.md",
  "14-algorithms-and-artificial-intelligence.md",
  "15-digital-platforms-always-connected-human.md",
  "16-family-and-social-relations.md",
  "17-body-health-and-time.md",
  "18-education-knowledge-opportunities.md",
  "19-contemporary-slavery-global-economy.md",
  "20-different-experiences-across-countries.md",
  "21-dismantling-mechanisms-of-submission.md",
  "22-building-a-project-for-human-liberation.md"
];
const required = [
  "manuscript/introduction.md",
  ...chapterFiles.map((f) => join("manuscript", "chapters", f)),
  "manuscript/conclusion.md",
  "index.html"
];
const errors = [];
for (const file of required) {
  const full = join(root, file);
  if (!existsSync(full)) {
    errors.push(`Missing required file: ${file}`);
    continue;
  }
  const content = readFileSync(full, "utf8").trim();
  if (!content) errors.push(`Empty file: ${file}`);
  if (file.endsWith(".md") && !/^#\s+\S/m.test(content)) {
    errors.push(`Missing top-level Markdown heading: ${file}`);
  }
}
const html = readFileSync(join(root, "index.html"), "utf8");
for (const id of ["intro", ...chapterFiles.map((_, i) => `ch${i + 1}`), "conclusion", "references"]) {
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    errors.push(`Reader navigation/content target missing: #${id}`);
  }
}
if (!html.includes('id="content"') && !html.includes("id='content'")) {
  errors.push("Reader content container #content is missing.");
}
if (errors.length) {
  console.error("Manuscript validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Manuscript validation passed: ${required.length} required files and reader targets checked.`);
console.log("Note: this is a structural check only; it does not certify academic accuracy, completeness, citations, or editorial approval.");
