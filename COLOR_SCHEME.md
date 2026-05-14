# Color Scheme & Logo Organization

## Overview
This document outlines the color scheme and logo organization for the WanderPH and A-M Travel project.

---

## Color Palette

### Dark Theme - Primary Colors
- **Background**: `#1a1a1a` (Dark)
- **Surface**: `#252525` (Slightly lighter surface)
- **Text**: `#f4f4f4` (Light text)

### Brand Colors
- **Primary**: `#023E8A` (Navy Blue) - Used for primary actions and accents
- **Secondary**: `#0096C7` (Cyan Blue) - Used for secondary elements
- **Accent**: `#03045E` (Deep Navy) - Used for deep emphasis

### Utility Colors
- **Border**: `rgba(244, 244, 244, 0.08)` - Subtle borders on dark background
- **Hover State**: `rgba(2, 62, 138, 0.1)` - Subtle hover overlay

---

## Logo Assets

### Available Logo Files
Located in `/assets/images/`

1. **am-logo-full.png**
   - Full logo with text/wordmark
   - Use in: Login pages, hero sections, branding areas
   - Recommended size: 200px - 300px width

2. **am-logomark.png**
   - Logo mark/icon only
   - Use in: Navigation bars, sidebars, favicons
   - Recommended size: 32px - 48px height

---

## Logo Placement by Page

### Main Site (index.html)
- **Navbar**: `am-logomark.png` (32-48px) + Text "WanderPH"
- Location: `assets/images/`

### CRM Portal

#### Login Page (login.html)
- **Card Header**: `am-logo-full.png` (72px)
- Location: `../assets/images/am-logo-full.png`

#### Dashboard & Other Pages (*.html)
- **Sidebar**: `am-logomark.png` (36px) + Text "A-M Travel"
- Location: `../assets/images/am-logomark.png`

---

## CSS Classes for Logo Usage

### Container Classes
- `.logo-wrapper` - Basic logo container with hover effect
- `.logo-with-text` - Logo image + text side by side
- `.nav-logo-container` - Navigation bar logo styling
- `.sidebar-logo-container` - Sidebar logo styling
- `.login-logo-container` - Login page logo styling

### Image Classes
- `.logo-image` - Base logo image styling (48px height)
- `.logo-image.small` - Smaller variant (32px)
- `.logo-image.large` - Larger variant (64px)

### Imported Stylesheet
- **File**: `assets/logos.css`
- Contains all logo-related styling
- Responsive design included

---

## Color Usage Guidelines

### Primary Color (#023E8A)
- Primary buttons
- Active navigation items
- Links
- Form focus states

### Secondary Color (#0096C7)
- Secondary buttons
- Accent highlights
- Active badges
- Hover states

### Accent Color (#03045E)
- Deep emphasis
- Text on light backgrounds
- Special highlights

### Text Color (#f4f4f4)
- All body text
- Headings
- Labels

---

## Implementation Checklist

- ✅ Logo files organized in `/assets/images/`
- ✅ Color variables defined in CSS root
- ✅ Logo styling in `assets/logos.css`
- ✅ Main site navbar updated
- ✅ CRM portal login page updated
- ✅ CRM portal sidebar updated on all pages
- ✅ Color scheme applied to CRM portal
- ✅ Dark theme enabled across all pages

---

## Quick Reference

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Dark Theme | #1a1a1a |
| Text | Light | #f4f4f4 |
| Primary | Navy Blue | #023E8A |
| Secondary | Cyan Blue | #0096C7 |
| Accent | Deep Navy | #03045E |
| Borders | Light Transparent | rgba(244, 244, 244, 0.08) |

---

## Notes

- All colors use CSS variables for easy global updates
- Logos are PNG format, optimized for web
- Responsive sizing ensures proper display on all devices
- Dark theme is the default across all pages
