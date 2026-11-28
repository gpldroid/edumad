#!/usr/bin/env node
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const chapters = [
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
const files = [
  "manuscript/introduction.md",
  ...chapters.map((name) => join("manuscript", "chapters", name)),
  "manuscript/conclusion.md"
];
const missing = [];
const sections = files.map((file, index) => {
  let content;
  try {
    content = readFileSync(join(root, file), "utf8").trim();
  } catch {
    missing.push(file);
    return "";
  }
  if (!content) missing.push(file);
  return (index === 0 ? "" : "\n\n\\newpage\n\n") + content;
});
if (missing.length) {
  console.error("Cannot build review manuscript. Missing or empty files:");
  for (const file of missing) console.error("- " + file);
  process.exit(1);
}
const cover = [
  "**نسخة مراجعة داخلية — غير معتمدة للنشر النهائي**",
  "",
  "تضم هذه النسخة المقدمة والفصول 1–22 والخاتمة. تظل المراجعة الأكاديمية المستقلة والتحقق النهائي من الطبعات والصفحات والمراجع شرطاً قبل اعتمادها للنشر.",
  "",
  "\\newpage",
  ""
].join("\n");
const output = cover + sections.join("");
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "edumad-manuscript-review.md"), output + "\n", "utf8");
console.log(`Built review manuscript from ${files.length} source files (${output.length.toLocaleString("en")} characters).`);
