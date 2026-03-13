const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const TurndownService = require("turndown");

const turndown = new TurndownService();

// 1️⃣ List of pages to migrate
const pages = [
  { url: "https://docs.ramp.com/introduction", path: "getting-started/introduction.mdx" },
  { url: "https://docs.ramp.com/authentication", path: "getting-started/authentication.mdx" },
  { url: "https://docs.ramp.com/cards", path: "api-reference/cards.mdx" },
  { url: "https://docs.ramp.com/expenses", path: "api-reference/expenses.mdx" },
  { url: "https://docs.ramp.com/transactions", path: "api-reference/transactions.mdx" },
  { url: "https://docs.ramp.com/webhooks", path: "api-reference/webhooks.mdx" },
  { url: "https://docs.ramp.com/accounting", path: "guides/accounting.mdx" },
  { url: "https://docs.ramp.com/reimbursements", path: "guides/reimbursements.mdx" }
];

// 2️⃣ Ensure folders exist
pages.forEach(page => {
  const folder = page.path.split("/")[0];
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

async function migratePage(page) {
  try {
    const { data } = await axios.get(page.url);
    const $ = cheerio.load(data);

    // Use Ramp-specific content selector
    const htmlContent = $(".documentation__content").html() || "<p>Content missing</p>";

    // Convert HTML → Markdown
    const mdContent = turndown.turndown(htmlContent);

    // Add frontmatter
    const title = page.path.split("/")[1];
    const mdx = `---
title: ${title}
description: Migrated from Ramp docs
---

${mdContent}
`;

    fs.writeFileSync(page.path, mdx);
    console.log(`✅ Migrated ${page.path}`);
  } catch (err) {
    console.error(`❌ Failed to migrate ${page.path}:`, err.message);
  }
}

// 4️⃣ Run migration for all pages
(async () => {
  for (const page of pages) {
    await migratePage(page);
  }
  console.log("🚀 Migration complete!");
})();