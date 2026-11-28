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
  "\\pagenumbering{gobble}",
  "\\begin{titlepage}",
  "\\begin{center}",
  "\\vspace*{0.12\\textheight}",
  "{\\color{EdumadGold}\\rule{0.72\\textwidth}{1.2pt}\\par}",
  "\\vspace{1.5cm}",
  "{\\Huge\\bfseries\\color{EdumadNavy} العبودية المعاصرة\\par}",
  "\\vspace{1.1cm}",
  "\\vspace{2.2cm}",
  "{\\large\\bfseries\\color{EdumadInk} تأليف\\par}",
  "\\vspace{0.35cm}",
  "{\\LARGE\\color{EdumadNavy} عماد لمراني\\par}",
  "\\vfill",
  "{\\color{EdumadGold}\\rule{0.42\\textwidth}{0.8pt}\\par}",
  "\\vspace{0.6cm}",
  "{\\small\\color{EdumadMuted} نسخة مراجعة داخلية — غير معتمدة للنشر النهائي\\par}",
  "\\vspace{0.4cm}",
  "{\\footnotesize\\color{EdumadMuted} EDUMAD\\par}",
  "\\end{center}",
  "\\end{titlepage}",
  "\\clearpage",
  "\\thispagestyle{empty}",
  "\\begin{center}",
  "\\vspace*{0.34\\textheight}",
  "{\\large\\bfseries حقوق النص\\par}",
  "\\vspace{0.8cm}",
  "{\\normalsize © عماد لمراني. جميع الحقوق محفوظة.\\par}",
  "\\vspace{0.4cm}",
  "{\\small لا يجوز إعادة نشر هذا العمل أو استغلاله تجارياً دون إذن المؤلف.\\par}",
  "\\vfill",
  "{\\footnotesize نسخة عمل للمراجعة والتصميم؛ لا تمثل اعتماداً نهائياً للنشر.\\par}",
  "\\end{center}",
  "\\clearpage",
  "\\pagenumbering{roman}",
  "\\setcounter{tocdepth}{0}",
  "\\tableofcontents",
  "\\clearpage",
  "\\pagenumbering{arabic}",
  ""
].join("\n");
const output = cover + sections.join("");
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "edumad-manuscript-review.md"), output + "\n", "utf8");
console.log(`Built review manuscript from ${files.length} source files (${output.length.toLocaleString("en")} characters).`);
