const fs = require("fs");

console.log("Script running...");

const pages = [
  "getting-started/introduction",
  "getting-started/authentication",
  "api-reference/cards",
  "api-reference/expenses",
  "api-reference/transactions",
  "api-reference/webhooks",
  "guides/accounting",
  "guides/reimbursements"
];

pages.forEach((page) => {
  const path = `${page}.mdx`;
  const folder = path.substring(0, path.lastIndexOf("/"));

  fs.mkdirSync(folder, { recursive: true });

  const title = page.split("/").pop().replace("-", " ");

  const content = `---
title: ${title}
---

# ${title}

Content migrated from Ramp documentation.
`;

  fs.writeFileSync(path, content);
});

console.log("Pages generated!");