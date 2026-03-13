const fs = require('fs');
const path = require('path');

const SOURCE_DIR = '/Users/melissatran/Downloads/ramp-mintlify';
const DEST_DIR = '/Users/melissatran/Documents/ramp-docs';

// Step 1: Copy folders from ramp-mintlify to ramp-docs
const foldersToCopy = ['authentication', 'guides', 'introduction'];

console.log('=== Step 1: Copying folders ===');
for (const folder of foldersToCopy) {
  const src = path.join(SOURCE_DIR, folder);
  const dest = path.join(DEST_DIR, folder);
  if (!fs.existsSync(src)) {
    console.warn(`  WARNING: Source folder not found: ${src}`);
    continue;
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`  Copied ${folder}/ -> ${DEST_DIR}/${folder}/`);
}

// Step 2: Generate OpenAPI MDX stub files for api-reference pages

// Mapping of slug (relative to api-reference/) -> "METHOD /path"
const slugToOpenAPI = {
  'accounting/list-gl-accounts': 'GET /developer/v1/accounting/accounts',
  'accounting/upload-gl-accounts': 'POST /developer/v1/accounting/accounts',
  'accounting/get-gl-account': 'GET /developer/v1/accounting/accounts/{gl_account_id}',
  'accounting/update-gl-account': 'PATCH /developer/v1/accounting/accounts/{gl_account_id}',
  'accounting/delete-gl-account': 'DELETE /developer/v1/accounting/accounts/{gl_account_id}',
  'accounting/list-all-connections': 'GET /developer/v1/accounting/all-connections',
  'accounting/get-connection': 'GET /developer/v1/accounting/connection/{connection_id}',
  'accounting/register-connection': 'POST /developer/v1/accounting/connection',
  'accounting/update-connection': 'PATCH /developer/v1/accounting/connection/{connection_id}',
  'accounting/disconnect-connection': 'DELETE /developer/v1/accounting/connection',
  'accounting/reactivate-connection': 'POST /developer/v1/accounting/connection/{connection_id}/reactivate',
  'accounting/list-field-options': 'GET /developer/v1/accounting/field-options',
  'accounting/upload-field-options': 'POST /developer/v1/accounting/field-options',
  'accounting/get-field-option': 'GET /developer/v1/accounting/field-options/{field_option_id}',
  'accounting/update-field-option': 'PATCH /developer/v1/accounting/field-options/{field_option_id}',
  'accounting/delete-field-option': 'DELETE /developer/v1/accounting/field-options/{field_option_id}',
  'accounting/list-fields': 'GET /developer/v1/accounting/fields',
  'accounting/create-field': 'POST /developer/v1/accounting/fields',
  'accounting/get-field': 'GET /developer/v1/accounting/fields/{field_id}',
  'accounting/update-field': 'PATCH /developer/v1/accounting/fields/{field_id}',
  'accounting/delete-field': 'DELETE /developer/v1/accounting/fields/{field_id}',
  'accounting/get-inventory-item': 'GET /developer/v1/accounting/inventory-item',
  'accounting/create-inventory-item': 'POST /developer/v1/accounting/inventory-item',
  'accounting/update-inventory-item': 'PATCH /developer/v1/accounting/inventory-item',
  'accounting/delete-inventory-item': 'DELETE /developer/v1/accounting/inventory-item',
  'accounting/list-inventory-item-options': 'GET /developer/v1/accounting/inventory-item/options',
  'accounting/upload-inventory-item-options': 'POST /developer/v1/accounting/inventory-item/options',
  'accounting/update-inventory-item-option': 'PATCH /developer/v1/accounting/inventory-item/options/{option_id}',
  'accounting/delete-inventory-item-option': 'DELETE /developer/v1/accounting/inventory-item/options/{option_id}',
  'accounting/post-sync-status': 'POST /developer/v1/accounting/syncs',
  'accounting/get-tax-code': 'GET /developer/v1/accounting/tax/code',
  'accounting/create-tax-code': 'POST /developer/v1/accounting/tax/code',
  'accounting/update-tax-code': 'PATCH /developer/v1/accounting/tax/code',
  'accounting/delete-tax-code': 'DELETE /developer/v1/accounting/tax/code',
  'accounting/list-tax-code-options': 'GET /developer/v1/accounting/tax/code/options',
  'accounting/upload-tax-code-options': 'POST /developer/v1/accounting/tax/code/options',
  'accounting/update-tax-code-option': 'PATCH /developer/v1/accounting/tax/code/options/{option_id}',
  'accounting/delete-tax-code-option': 'DELETE /developer/v1/accounting/tax/code/options/{option_id}',
  'accounting/list-tax-rates': 'GET /developer/v1/accounting/tax/rates',
  'accounting/upload-tax-rates': 'POST /developer/v1/accounting/tax/rates',
  'accounting/update-tax-rate': 'PATCH /developer/v1/accounting/tax/rates/{tax_rate_id}',
  'accounting/delete-tax-rate': 'DELETE /developer/v1/accounting/tax/rates/{tax_rate_id}',
  'accounting/list-vendors': 'GET /developer/v1/accounting/vendors',
  'accounting/upload-vendors': 'POST /developer/v1/accounting/vendors',
  'accounting/get-vendor': 'GET /developer/v1/accounting/vendors/{vendor_id}',
  'accounting/update-vendor': 'PATCH /developer/v1/accounting/vendors/{vendor_id}',
  'accounting/delete-vendor': 'DELETE /developer/v1/accounting/vendors/{vendor_id}',

  'cards/list-cards': 'GET /developer/v1/cards',
  'cards/create-virtual-card': 'POST /developer/v1/cards/deferred/virtual',
  'cards/create-physical-card': 'POST /developer/v1/cards/deferred/physical',
  'cards/get-deferred-task': 'GET /developer/v1/cards/deferred/status/{task_id}',
  'cards/get-card': 'GET /developer/v1/cards/{card_id}',
  'cards/update-card': 'PATCH /developer/v1/cards/{card_id}',
  'cards/suspend-card': 'POST /developer/v1/cards/{card_id}/deferred/suspension',
  'cards/unsuspend-card': 'POST /developer/v1/cards/{card_id}/deferred/unsuspension',
  'cards/terminate-card': 'POST /developer/v1/cards/{card_id}/deferred/termination',

  'bills/list-bills': 'GET /developer/v1/bills',
  'bills/create-bill': 'POST /developer/v1/bills',
  'bills/get-bill': 'GET /developer/v1/bills/{bill_id}',
  'bills/update-bill': 'PATCH /developer/v1/bills/{bill_id}',
  'bills/archive-bill': 'DELETE /developer/v1/bills/{bill_id}',
  'bills/upload-attachment': 'POST /developer/v1/bills/{bill_id}/attachments',
  'bills/list-draft-bills': 'GET /developer/v1/bills/drafts',
  'bills/create-draft-bill': 'POST /developer/v1/bills/drafts',
  'bills/get-draft-bill': 'GET /developer/v1/bills/drafts/{draft_bill_id}',
  'bills/update-draft-bill': 'PATCH /developer/v1/bills/drafts/{draft_bill_id}',
  'bills/upload-draft-attachment': 'POST /developer/v1/bills/drafts/{draft_bill_id}/attachments',

  'transactions/list-transactions': 'GET /developer/v1/transactions',
  'transactions/get-transaction': 'GET /developer/v1/transactions/{transaction_id}',
  'transactions/update-transaction': 'PATCH /developer/v1/transactions/{transaction_id}',

  'users/list-users': 'GET /developer/v1/users',
  'users/create-user': 'POST /developer/v1/users/deferred',
  'users/get-deferred-task': 'GET /developer/v1/users/deferred/status/{task_id}',
  'users/get-user': 'GET /developer/v1/users/{user_id}',
  'users/update-user': 'PATCH /developer/v1/users/{user_id}',
  'users/terminate-user': 'PATCH /developer/v1/users/{user_id}/deactivate',

  'reimbursements/list-reimbursements': 'GET /developer/v1/reimbursements',
  'reimbursements/get-reimbursement': 'GET /developer/v1/reimbursements/{reimbursement_id}',

  'statements/list-statements': 'GET /developer/v1/statements',
  'statements/get-statement': 'GET /developer/v1/statements/{statement_id}',

  'limits/list-limits': 'GET /developer/v1/limits',
  'limits/get-limit': 'GET /developer/v1/limits/{spend_limit_id}',

  'entities/list-entities': 'GET /developer/v1/entities',
  'entities/get-entity': 'GET /developer/v1/entities/{entity_id}',

  'memos/list-memos': 'GET /developer/v1/memos',
  'memos/get-memo': 'GET /developer/v1/memos/{transaction_id}',

  'receipts/list-receipts': 'GET /developer/v1/receipts',
  'receipts/get-receipt': 'GET /developer/v1/receipts/{receipt_id}',

  'bank-accounts/get-bank-account': 'GET /developer/v1/bank-accounts/{bank_account_id}',

  'leads/create-lead': 'POST /developer/v1/leads',

  'spend-programs/list-spend-programs': 'GET /developer/v1/spend-programs',
  'spend-programs/create-spend-program': 'POST /developer/v1/spend-programs',
  'spend-programs/get-spend-program': 'GET /developer/v1/spend-programs/{spend_program_id}',
  'spend-programs/update-spend-program': 'PATCH /developer/v1/spend-programs/{spend_program_id}',

  'departments/list-departments': 'GET /developer/v1/departments',
  'departments/create-department': 'POST /developer/v1/departments',
  'departments/get-department': 'GET /developer/v1/departments/{department_id}',
  'departments/update-department': 'PATCH /developer/v1/departments/{department_id}',

  'locations/list-locations': 'GET /developer/v1/locations',
  'locations/create-location': 'POST /developer/v1/locations',
  'locations/get-location': 'GET /developer/v1/locations/{location_id}',
  'locations/update-location': 'PATCH /developer/v1/locations/{location_id}',

  'custom-records/list-custom-tables': 'GET /developer/v1/custom-records/custom-tables',
  'custom-records/create-custom-table': 'POST /developer/v1/custom-records/configure/custom-tables',
  'custom-records/list-custom-table-columns': 'GET /developer/v1/custom-records/custom-tables/{custom_table_name}/columns',
  'custom-records/create-custom-table-column': 'POST /developer/v1/custom-records/configure/custom-tables/{custom_table_name}/columns',
  'custom-records/rename-custom-table-column': 'PATCH /developer/v1/custom-records/configure/custom-tables/{custom_table_name}/columns/{column_name}',
  'custom-records/extend-native-table': 'POST /developer/v1/custom-records/configure/native-tables',
  'custom-records/create-native-table-column': 'POST /developer/v1/custom-records/configure/native-tables/{native_table_name}/columns',
  'custom-records/rename-native-table-column': 'PATCH /developer/v1/custom-records/configure/native-tables/{native_table_name}/columns/{column_name}',

  'audit-logs/list-events': 'GET /developer/v1/audit-logs/events',

  'cashbacks/list-cashbacks': 'GET /developer/v1/cashbacks',
  'cashbacks/get-cashback': 'GET /developer/v1/cashbacks/{cashback_id}',

  'business/get-business': 'GET /developer/v1/business',
  'business/get-balance': 'GET /developer/v1/business/balance',
};

/**
 * Convert a slug like "list-gl-accounts" to a title like "List GL Accounts".
 * Capitalizes the first letter of each word.
 */
function slugToTitle(slug) {
  // Take only the last segment (after the last '/')
  const name = slug.split('/').pop();
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

console.log('\n=== Step 2: Generating OpenAPI MDX stub files ===');
let created = 0;
let skipped = 0;

for (const [slug, openapi] of Object.entries(slugToOpenAPI)) {
  const filePath = path.join(DEST_DIR, 'api-reference', slug + '.mdx');
  const dir = path.dirname(filePath);

  // Ensure the directory exists
  fs.mkdirSync(dir, { recursive: true });

  const title = slugToTitle(slug);
  const content = `---\ntitle: "${title}"\nopenapi: "${openapi}"\n---\n`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Created: api-reference/${slug}.mdx`);
  created++;
}

console.log(`\nDone! Created ${created} MDX files.`);
console.log('Setup complete.');
