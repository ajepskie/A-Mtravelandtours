# Invoice Generator Setup Guide

## ✅ Completed Tasks

I've successfully implemented the invoice generator for your AM Travel CRM with the following features:

### 1. **Sidebar Role Display** ✅
- Added sidebar role element (`<div class="sidebar-role">`) to all pages
- The role is displayed with appropriate styling (emoji badge with color coding)
- Updated all navigation pages:
  - `dashboard.html`
  - `clients.html`
  - `add-client.html`
  - `edit-client.html`
  - `client-detail.html`
  - `sales.html`
  - `worker-performance.html`
  - `backup.html`
  - `users.html`

### 2. **Invoice Navigation Link** ✅
- Added "🧾 Invoice" link to the sidebar navigation in all pages
- Link is visible only to Admin and Super Admin roles (admin-only class)
- Navigation link placed between "Sales & Quotes" and "Workers" sections

### 3. **Invoice Generator Page** ✅ 
Created `invoice.html` with the following features:

#### Access Control
- Only Admin and Super Admin roles can access the invoice generator
- Employee/Worker and Tester roles are redirected with an access denied message
- Automatic redirect to dashboard for unauthorized users

#### Invoice Creation Workflow
1. **Select Quote** - Dropdown selector with search by client name or quote reference
2. **Invoice Details** - Auto-generated invoice number, dates, and travel date
3. **Invoice Preview** - Real-time preview with all invoice details
4. **Actions** - Download PDF or Save to Supabase

#### Features Implemented
- ✅ Quote selection dropdown with search filter
- ✅ Auto-fill from quotes table:
  - Client name
  - Line items (Type, Description, Cost, Margin %, Upsell)
  - Totals (Cost, Margin, Upsell, Grand Total)
  - Travel date
- ✅ Unique invoice number generation: `INV-YYYYMMDD-XXXX`
- ✅ Invoice date management (Issue date, Due date - defaults to 7 days)
- ✅ Currency switcher (AED/PHP)
- ✅ PDF generation with:
  - Professional header with company branding (#023E8A)
  - Company info: AM Travel & Tours, Est 2026, Dubai UAE, +971 56 471 8805
  - Accent color: #0096C7
  - Itemized table with Type, Description, Cost, Margin %, Upsell, Total
  - Summary box: Subtotal, Margin, Upsell, Discount, Grand Total
  - Professional footer with payment terms and company contact
  - Multi-currency support
- ✅ Save invoice to Supabase `invoices` table
- ✅ jsPDF and jsPDF-autotable from CDN
- ✅ Uses existing `css/crm.css` for styling
- ✅ Uses existing `js/config.js` and `js/auth.js` for Supabase and authentication

### 4. **Auth Functions** ✅
Added to `js/auth.js`:
```javascript
// Check if role can access invoices
function canAccessInvoices(role) {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);
}
```

---

## 📋 Next Steps: Supabase Setup

### Step 1: Create the Invoices Table

1. Go to your Supabase Dashboard: https://supabase.com
2. Select your project: `wanderph`
3. Navigate to **SQL Editor**
4. Create a new query and copy the entire content from:
   - [SUPABASE_MIGRATION_INVOICES.sql](../SUPABASE_MIGRATION_INVOICES.sql)
5. Click **Run** to execute the migration

This will create:
- `invoices` table with all required columns
- Indexes for optimized queries
- Row Level Security (RLS) policies for Admin/Super Admin access

### Step 2: Generate TypeScript Types (Optional)

After creating the table, you can generate TypeScript types:
```bash
npm run types
```

This will update your type definitions for the new `invoices` table.

---

## 🎯 How to Use

### For Admin/Super Admin Users:

1. **Navigate to Invoice Generator**
   - Click "🧾 Invoice" in the sidebar
   - Or go to `invoice.html`

2. **Create an Invoice**
   - Select a quote from the dropdown or search by client name
   - System auto-fills: client name, travel date, line items, costs
   - Invoice number and dates are auto-generated
   - Choose currency (AED or PHP)

3. **Download PDF**
   - Click "📄 Download PDF" to generate and download the PDF
   - PDF includes all required formatting, header, and footer

4. **Save Invoice**
   - Click "💾 Save Invoice" to store in Supabase
   - Invoice is saved as "Draft" status
   - Can be updated or deleted by admins

---

## 📊 Invoice Table Schema

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `invoice_number` | VARCHAR(50) | Unique, format: INV-YYYYMMDD-XXXX |
| `quote_id` | UUID | Reference to quotes table |
| `client_id` | UUID | Reference to clients table |
| `client_name` | VARCHAR(255) | Client name from quote |
| `issue_date` | DATE | Invoice issue date |
| `due_date` | DATE | Invoice due date |
| `travel_date` | DATE | Travel date from quote |
| `currency` | VARCHAR(10) | AED or PHP |
| `items` | JSONB | Line items array from quote |
| `total_cost` | DECIMAL | Total cost |
| `total_margin` | DECIMAL | Total margin |
| `total_upsell` | DECIMAL | Total upsell |
| `discount` | DECIMAL | Discount amount |
| `grand_total` | DECIMAL | Final grand total |
| `created_by` | UUID | User who created the invoice |
| `status` | VARCHAR(50) | Invoice status (Draft, Sent, Paid, etc.) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

---

## 🔒 Security & Access Control

**Role-Based Access:**
- ✅ Super Admin: Full access
- ✅ Admin: Full access
- ❌ Accounts: Not allowed
- ❌ Employee/Worker: Not allowed
- ❌ Tester: Not allowed

**Row Level Security (RLS):**
- Admins can view all invoices
- Admins can create new invoices
- Admins can update existing invoices
- Admins can delete invoices
- All other roles: No access

---

## 🎨 Customization

### Invoice Header
Edit the company information in `invoice.html` (lines ~550-560):
```javascript
doc.text('AM TRAVEL & TOURS', 14, 15); // Company name
doc.text('Est. 2026  |  Dubai, UAE  |  +971 56 471 8805', 14, 23); // Company info
```

### Colors
- Header Background: `#023E8A` (Dark Blue)
- Accent Color: `#0096C7` (Bright Blue)
- These are also defined in `css/crm.css` as `--accent` and `--accent-secondary`

### Invoice Number Format
Current format: `INV-YYYYMMDD-XXXX`
To change, edit the `generateInvoiceNumber()` function in `invoice.html` (line ~330)

---

## 🐛 Troubleshooting

### Invoice dropdown is empty
- Ensure there are quotes in the `quotes` table
- Check that the current user is Admin or Super Admin
- Verify Supabase connection in `js/config.js`

### PDF not generating
- Ensure jsPDF libraries are loaded (check browser console)
- Verify that CDN URLs are accessible
- Check browser console for errors

### Permission denied when saving
- Verify the user's role is Admin or Super Admin
- Check that `invoices` table RLS policies are correctly set
- Ensure migration was successfully applied

### Invoice not saved to Supabase
- Check Supabase dashboard for errors in SQL Editor
- Verify the `invoices` table exists
- Check network tab in browser developer tools for API errors

---

## 📝 Files Modified/Created

### Created:
- ✅ `crm-portal/invoice.html` - Main invoice generator page
- ✅ `SUPABASE_MIGRATION_INVOICES.sql` - Database migration script

### Modified:
- ✅ `crm-portal/js/auth.js` - Added `canAccessInvoices()` function
- ✅ `crm-portal/dashboard.html` - Added invoice navigation link
- ✅ `crm-portal/clients.html` - Added invoice navigation link
- ✅ `crm-portal/add-client.html` - Added invoice navigation link
- ✅ `crm-portal/edit-client.html` - Added invoice navigation link
- ✅ `crm-portal/client-detail.html` - Added invoice navigation link
- ✅ `crm-portal/sales.html` - Added invoice navigation link
- ✅ `crm-portal/worker-performance.html` - Added invoice navigation link
- ✅ `crm-portal/backup.html` - Added invoice navigation link
- ✅ `crm-portal/users.html` - Added invoice navigation link

---

## ✨ Summary

The invoice generator is now fully implemented and ready to use! The sidebar role display is active on all pages, showing the user's role with appropriate styling. Admin and Super Admin users can access the invoice generator to create professional invoices from quotes, generate PDFs, and save them to Supabase.

**Next Action Required:** Execute the SQL migration to create the `invoices` table in your Supabase database.
