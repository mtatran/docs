const fs = require("fs");

const markdown = fs.readFileSync("ramp-api.md", "utf-8");

// Simple split by level 2 headers `##` (adjust if needed)
const sections = markdown.split(/^##\s+/m).filter(s => s.trim() !== "");

sections.forEach(section => {
  const lines = section.split("\n");
  const title = lines[0].trim().toLowerCase().replace(/\s+/g, "-"); // e.g., "Cards API" → "cards-api"
  const content = lines.slice(1).join("\n");

  // Decide folder based on tags, or put all under api-reference
  const folder = "api-reference";
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const mdx = `---
title: ${lines[0].trim()}
description: Migrated from Ramp OpenAPI
---

${content}
`;

  fs.writeFileSync(`${folder}/${title}.mdx`, mdx);
  console.log(`✅ Generated ${folder}/${title}.mdx`);
});