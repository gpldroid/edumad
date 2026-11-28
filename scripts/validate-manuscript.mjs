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
let bibliographyChecks = 0;

for (const file of required) {
  const full = join(root, file);
  if (!existsSync(full)) {
    errors.push(`Missing required file: ${file}`);
    continue;
  }

  const content = readFileSync(full, "utf8").trim();
  if (!content) {
    errors.push(`Empty file: ${file}`);
    continue;
  }
  if (file.endsWith(".md") && !/^#\s+\\S/m.test(content)) {
    errors.push(`Missing top-level Markdown heading: ${file}`);
  }

  if (file.includes(join("manuscript", "chapters"))) {
    const lines = content.split(/\r?\n/);
    const bibliographyHeadings = [];
    const bodyHeadings = [];
    const levelTwoHeadings = [];

    lines.forEach((line, index) => {
      if (/^##\s+(?:مراجع|المراجع|مصادر|المصادر)/.test(line)) {
        bibliographyHeadings.push(index);
      }
      if (/^##\s+(?:تمهيد|المبحث|خلاصة|خاتمة|التمهيد|الخاتمة)/.test(line)) {
        bodyHeadings.push(index);
      }
      if (/^##\s+/.test(line)) {
        levelTwoHeadings.push({ title: line.trim(), line: index + 1 });
      }
    });

    if (bibliographyHeadings.length === 0) {
      errors.push(`Missing chapter bibliography heading: ${file}`);
    } else if (bibliographyHeadings.length > 1) {
      errors.push(`Multiple level-two bibliography sections; merge them into one final section: ${file}`);
    } else {
      const bibliographyIndex = bibliographyHeadings[0];
      const lastBodyIndex = bodyHeadings.at(-1) ?? -1;
      if (bibliographyIndex < lastBodyIndex) {
        errors.push(`Bibliography appears before the final chapter section: ${file}`);
      }
      const bibliographyText = lines.slice(bibliographyIndex + 1).join("\n");
      if (!/^\s*(?:[-*]\s+|\\d+[.)]\s+)/m.test(bibliographyText)) {
        errors.push(`Bibliography section has no detectable reference entries: ${file}`);
      }
      bibliographyChecks += 1;
    }

    const seen = new Map();
    for (const heading of levelTwoHeadings) {
      if (seen.has(heading.title)) {
        errors.push(`Duplicate level-two heading in ${file}: ${heading.title} (lines ${seen.get(heading.title)} and ${heading.line})`);
      } else {
        seen.set(heading.title, heading.line);
      }
    }
  }
}

const html = readFileSync(join(root, "index.html"), "utf8");
for (const id of ["intro", "conclusion"]) {
  if (!html.includes(`id:"${id}"`) && !html.includes(`id:'${id}'`) && !html.includes(`href="#${id}"`)) {
    errors.push(`Reader navigation entry or generated content target missing: #${id}`);
  }
}
if (!html.includes('id:`ch${index+1}`') && !html.includes('id:`ch${index + 1}`')) {
  errors.push("Reader does not generate chapter anchors from the chapter index.");
}
if (!html.includes('id="references"') && !html.includes("id='references'")) {
  errors.push("Reader references section is missing.");
}
if (!html.includes('id="content"') && !html.includes("id='content'")) {
  errors.push("Reader content container #content is missing.");
}

if (errors.length) {
  console.error("Manuscript validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Manuscript validation passed: ${required.length} required files, reader targets, and ${bibliographyChecks} chapter bibliography placements checked.`);
console.log("Note: this is a structural check only; it does not certify academic accuracy, completeness, source validity, citations, or editorial approval.");
