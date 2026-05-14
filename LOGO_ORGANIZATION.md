# Logo Organization & Integration Guide

## 📁 File Structure

```
wanderph/
├── assets/
│   ├── images/
│   │   ├── am-logo-full.png      ← Full logo with text
│   │   └── am-logomark.png       ← Icon/mark only
│   └── logos.css                 ← All logo styling
├── crm-portal/
│   ├── css/
│   │   └── crm.css               ← Updated with new color vars
│   ├── dashboard.html            ← Logo in sidebar
│   ├── login.html                ← Logo in card header
│   ├── clients.html              ← Logo in sidebar
│   ├── add-client.html           ← Logo in sidebar
│   ├── edit-client.html          ← Logo in sidebar
│   ├── client-detail.html        ← Logo in sidebar
│   ├── users.html                ← Logo in sidebar
│   └── backup.html               ← Logo in sidebar
├── index.html                    ← Logo in navbar
├── style.css                     ← Updated navbar styles
├── COLOR_SCHEME.md               ← Color documentation
└── LOGO_ORGANIZATION.md          ← This file
```

---

## 🎨 Color Scheme Applied

### Dark Theme
- **Background**: #1a1a1a
- **Surface**: #252525
- **Text**: #f4f4f4
- **Primary**: #023E8A (Navy Blue)
- **Secondary**: #0096C7 (Cyan Blue)
- **Accent**: #03045E (Deep Navy)

All colors are defined as CSS variables in:
- `assets/logos.css` (logo-specific)
- `crm-portal/css/crm.css` (CRM portal)

---

## 🖼️ Logo Integration Details

### Main Site (index.html)

**Navbar Integration**
```html
<nav>
  <div class="nav-logo-container">
    <img src="assets/images/am-logomark.png" alt="A-M Travel Logo" class="logo-image small">
    <div class="nav-logo">Wander<span>PH</span></div>
  </div>
  <!-- rest of navbar -->
</nav>
```

**Logo Size**: 32px height (small variant)
**Location**: Left side of navbar
**CSS**: `assets/logos.css`

---

### CRM Portal

#### Login Page (login.html)

**Card Header Integration**
```html
<div class="login-logo-container">
  <img src="../assets/images/am-logo-full.png" alt="A-M Travel Logo" class="logo-image">
  <div class="login-text">
    <div class="login-logo">A-M <span>Travel</span></div>
    <div class="login-sub">Internal CRM System</div>
  </div>
</div>
```

**Logo Size**: 72px height
**Location**: Top of login card
**Link**: `../assets/images/am-logo-full.png`

---

#### All CRM Pages (dashboard.html, clients.html, etc.)

**Sidebar Integration**
```html
<aside class="sidebar">
  <div class="sidebar-logo-container">
    <img src="../assets/images/am-logomark.png" alt="A-M Travel Logo" class="logo-image">
    <div class="sidebar-logo">A-M <span>Travel</span></div>
  </div>
  <!-- rest of sidebar -->
</aside>
```

**Logo Size**: 36px height
**Location**: Top of sidebar
**Link**: `../assets/images/am-logomark.png`

---

## 📋 Updated Files Summary

### HTML Files Updated
- ✅ `index.html` - Navbar logo added
- ✅ `crm-portal/login.html` - Logo in login card
- ✅ `crm-portal/dashboard.html` - Logo in sidebar
- ✅ `crm-portal/clients.html` - Logo in sidebar
- ✅ `crm-portal/add-client.html` - Logo in sidebar
- ✅ `crm-portal/edit-client.html` - Logo in sidebar
- ✅ `crm-portal/client-detail.html` - Logo in sidebar
- ✅ `crm-portal/users.html` - Logo in sidebar
- ✅ `crm-portal/backup.html` - Logo in sidebar

### CSS Files Updated
- ✅ `assets/logos.css` - Created with all logo styling
- ✅ `style.css` - Added navbar logo container styles
- ✅ `crm-portal/css/crm.css` - Updated color variables

### Documentation Files Created
- ✅ `COLOR_SCHEME.md` - Color scheme reference
- ✅ `LOGO_ORGANIZATION.md` - This file

---

## 🎯 Logo Styling Classes

### Available Classes

#### Container Classes
| Class | Purpose | Used In |
|-------|---------|---------|
| `.logo-wrapper` | Basic container | General use |
| `.logo-with-text` | Logo + text | Flexible layouts |
| `.nav-logo-container` | Navigation | index.html navbar |
| `.sidebar-logo-container` | Sidebar | CRM pages |
| `.login-logo-container` | Login | login.html |

#### Image Classes
| Class | Height | Use |
|-------|--------|-----|
| `.logo-image` | 48px | Default |
| `.logo-image.small` | 32px | Navbar |
| `.logo-image.large` | 64px | Large displays |

---

## 📐 Responsive Design

The logo styling includes responsive breakdowns:

### Desktop (≥768px)
- Full-size logos
- Side-by-side layouts
- Hover effects enabled

### Tablet (≤768px)
- Reduced logo sizes
- Optimized spacing
- Touch-friendly

### Mobile (≤480px)
- Minimal spacing
- Stacked layouts where needed
- Optimized for small screens

---

## 🔧 How to Use the Logos

### To Replace or Update Logos
1. Replace PNG files in `/assets/images/`
2. Keep the same filenames:
   - `am-logo-full.png`
   - `am-logomark.png`
3. All HTML/CSS will automatically use the new files

### To Change Colors
1. Edit CSS variables in `assets/logos.css`
2. Update CRM colors in `crm-portal/css/crm.css`
3. Changes will apply globally

### To Adjust Logo Sizes
1. Modify `.logo-image` sizing in `assets/logos.css`
2. Or add custom size classes as needed

---

## ✅ Implementation Checklist

- [x] Logo files organized in `assets/images/`
- [x] Logo CSS created in `assets/logos.css`
- [x] Main navbar logo integrated
- [x] CRM login page logo integrated
- [x] CRM sidebar logos integrated on all pages
- [x] Color scheme applied across all pages
- [x] Responsive design included
- [x] Documentation created
- [x] All links properly pathed (relative paths for cross-folder access)

---

## 🚀 Next Steps (Optional)

If you want to further customize:

1. **Adjust logo sizes**: Edit the height values in `assets/logos.css`
2. **Change hover effects**: Modify `.logo-wrapper:hover` or `.nav-logo-container:hover`
3. **Add animations**: Include CSS animations in `assets/logos.css`
4. **Update favicon**: Add favicon link to use `am-logomark.png`
5. **Mobile optimization**: Test on different screen sizes and adjust breakpoints

---

## 📞 Support

For questions about:
- **Logo positioning**: Check `assets/logos.css`
- **Colors used**: See `COLOR_SCHEME.md`
- **File structure**: See this document
- **Implementation details**: Check the HTML files

All styling is CSS-based and easily customizable!
