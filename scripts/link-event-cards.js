const fs = require("fs");

const paths = [
  "c:/Users/huaweui/Downloads/Speak site/spk-main/en.html",
  "c:/Users/huaweui/Downloads/Speak site/spk-main/index.html",
];

const map = [
  [
    "mailto:Contact@speak.ma?subject=Past%20Event%20-%20Executive%20Communication",
    "./event.html?id=executive-communication",
  ],
  [
    "mailto:Contact@speak.ma?subject=Past%20Event%20-%20Leading%20Meetings",
    "./event.html?id=leading-meetings",
  ],
  [
    "mailto:Contact@speak.ma?subject=Upcoming%20Event%20-%20AI%20Business%20English",
    "./event.html?id=project-management-ai",
  ],
  [
    "mailto:Contact@speak.ma?subject=Upcoming%20Event%20-%20Pitch%20with%20Presence",
    "./event.html?id=pitch-with-presence",
  ],
  [
    "mailto:Contact@speak.ma?subject=Upcoming%20Event%20-%20Evening%20Conversations",
    "./event.html?id=evening-conversations",
  ],
];

for (const p of paths) {
  let h = fs.readFileSync(p, "utf8");
  for (const [from, to] of map) h = h.split(from).join(to);
  h = h.replaceAll("AI &amp; Business English", "Project Management Augmented by AI");
  h = h.replaceAll(
    "Practice the conversations that matter when tools and teams move fast.",
    "Gain efficiency with AI applied to project delivery."
  );
  h = h.replaceAll(
    "Upcoming event — AI &amp; Business English",
    "Upcoming event — Project Management Augmented by AI"
  );
  fs.writeFileSync(p, h);
  console.log(
    p.split("/").pop(),
    "links",
    (h.match(/event\.html\?id=/g) || []).length
  );
}
