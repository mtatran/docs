const fs = require('fs');
const path = require('path');

// Input OpenAPI JSON file
const OPENAPI_FILE = 'ramp-api.json';
// Output folder for MDX files
const OUTPUT_DIR = path.join(__dirname, 'api-reference');

// Read OpenAPI JSON
const api = JSON.parse(fs.readFileSync(OPENAPI_FILE, 'utf8'));

// Ensure output folder exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper: convert method/path to safe filename
function toFileName(method, pathStr) {
  return `${method.toLowerCase()}_${pathStr.replace(/[\/{}]/g, '_').replace(/__+/g, '_').replace(/^_+|_+$/g, '')}.mdx`;
}

// Helper: convert method to lowercase for code blocks
function methodLower(method) {
  return method.toLowerCase();
}

// Loop through all paths
for (const [pathStr, methods] of Object.entries(api.paths)) {
  for (const [method, info] of Object.entries(methods)) {
    const title = info.summary || `${method.toUpperCase()} ${pathStr}`;
    const description = info.description || 'No description provided';
    const fileName = toFileName(method, pathStr);
    const fullPath = path.join(OUTPUT_DIR, fileName);

    // Parameters table
    const params = (info.parameters || []).map(p => {
      return `| ${p.name} | ${p.in} | ${p.schema?.type || 'object'} | ${p.required ? 'true' : 'false'} | ${p.description || ''} |`;
    }).join('\n');

    // Responses table
    const responses = Object.entries(info.responses || {}).map(([status, resp]) => {
      return `| ${status} | ${resp.description || ''} | ${resp.content ? JSON.stringify(Object.keys(resp.content)) : 'None'} |`;
    }).join('\n');

    // MDX content
    const mdx = `---
title: ${fileName.replace('.mdx','')}
description: ${description}
---

# ${title}

\`${method.toUpperCase()} ${pathStr}\`

${description}

---

## Parameters

| Name | In | Type | Required | Description |
|------|----|------|---------|------------|
${params || '| - | - | - | - | - |'}

---

## Responses

| Status | Meaning | Schema |
|--------|---------|--------|
${responses || '| - | - | - |'}

---

<Warning>
You must be authenticated using OAuth2 if required.
</Warning>
`;

    fs.writeFileSync(fullPath, mdx);
    console.log(`✅ Generated ${fileName}`);
  }
}

console.log('All endpoints generated!');