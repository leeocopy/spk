const fs = require("fs");

const paths = [
  "c:/Users/huaweui/Downloads/Speak site/spk-main/en.html",
  "c:/Users/huaweui/Downloads/Speak site/spk-main/index.html",
];

/** [yearNum, month, day] */
const cards = [
  ["09", "May", "09"],
  ["10", "Apr", "18"],
  ["11", "Dec", "12"],
  ["12", "Jan", "23"],
  ["13", "Mar", "06"],
];

for (const p of paths) {
  let html = fs.readFileSync(p, "utf8");
  for (const [yearNum, month, day] of cards) {
    const from = `<div class="se-year">
                      <span class="se-year-label">Year</span>
                      <span class="se-year-num">${yearNum}</span>
                    </div>`;
    const to = `<div class="se-when">
                      <span class="se-when-month">${month}</span>
                      <span class="se-when-day">${day}</span>
                    </div>`;
    if (!html.includes(from)) {
      // tolerant whitespace
      const re = new RegExp(
        `<div class="se-year">\\s*<span class="se-year-label">Year</span>\\s*<span class="se-year-num">${yearNum}</span>\\s*</div>`,
        "g"
      );
      html = html.replace(
        re,
        `<div class="se-when">
                      <span class="se-when-month">${month}</span>
                      <span class="se-when-day">${day}</span>
                    </div>`
      );
    } else {
      html = html.replace(from, to);
    }
  }
  fs.writeFileSync(p, html);
  console.log(
    p.split("/").pop(),
    "when",
    (html.match(/se-when-day/g) || []).length,
    "year left",
    (html.match(/se-year-num/g) || []).length
  );
}
