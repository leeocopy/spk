const fs = require("fs");

const paths = [
  "c:/Users/huaweui/Downloads/Speak site/spk-main/en.html",
  "c:/Users/huaweui/Downloads/Speak site/spk-main/index.html",
];

const replacements = [
  ["May 09, 2025", "09"],
  ["Apr 18, 2026", "10"],
  ["Dec 12, 2026", "11"],
  ["Jan 23, 2027", "12"],
  ["Mar 06, 2027", "13"],
];

for (const p of paths) {
  let html = fs.readFileSync(p, "utf8");
  for (const [date, year] of replacements) {
    const from = `<span class="se-date">${date}</span>`;
    const to = `<div class="se-year">
                      <span class="se-year-label">Year</span>
                      <span class="se-year-num">${year}</span>
                    </div>`;
    html = html.replace(from, to);
  }
  fs.writeFileSync(p, html);
  console.log(
    p.split("/").pop(),
    "years",
    (html.match(/se-year-num/g) || []).length,
    "dates left",
    (html.match(/se-date/g) || []).length
  );
}
