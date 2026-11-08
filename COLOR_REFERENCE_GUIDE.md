# 🎨 ImageGallery 3.0 - Color Reference Guide

## 🎯 Professional Color Palette

### Primary Color: Blue
Modern, trustworthy, and professional

| Shade | Hex Code | Usage |
|-------|----------|-------|
| Blue 50 | `#eff6ff` | Backgrounds, subtle highlights |
| Blue 100 | `#dbeafe` | Light backgrounds |
| Blue 200 | `#bfdbfe` | Borders, dividers |
| Blue 300 | `#93c5fd` | Hover states |
| Blue 400 | `#60a5fa` | Interactive elements |
| **Blue 500** | **`#3b82f6`** | **Primary brand color** |
| Blue 600 | `#2563eb` | Pressed states, emphasis |
| Blue 700 | `#1d4ed8` | Text, strong emphasis |
| Blue 800 | `#1e40af` | Dark backgrounds |
| Blue 900 | `#1e3a8a` | Darkest shade |

### Accent Color: Purple
Creative, premium, and elegant

| Shade | Hex Code | Usage |
|-------|----------|-------|
| Purple 50 | `#faf5ff` | Light backgrounds |
| Purple 100 | `#f3e8ff` | Subtle highlights |
| Purple 200 | `#e9d5ff` | Borders |
| Purple 300 | `#d8b4fe` | Hover effects |
| Purple 400 | `#c084fc` | Interactive elements |
| **Purple 500** | **`#a855f7`** | **Accent color** |
| Purple 600 | `#9333ea` | Pressed states |
| Purple 700 | `#7e22ce` | Strong emphasis |
| Purple 800 | `#6b21a8` | Dark backgrounds |
| Purple 900 | `#581c87` | Darkest shade |

### Secondary Color: Cyan
Fresh, modern, and energetic

| Shade | Hex Code | Usage |
|-------|----------|-------|
| Cyan 50 | `#ecfeff` | Light backgrounds |
| Cyan 100 | `#cffafe` | Subtle highlights |
| Cyan 200 | `#a5f3fc` | Borders |
| Cyan 300 | `#67e8f9` | Hover effects |
| Cyan 400 | `#22d3ee` | Interactive elements |
| **Cyan 500** | **`#06b6d4`** | **Secondary color** |
| Cyan 600 | `#0891b2` | Pressed states |
| Cyan 700 | `#0e7490` | Strong emphasis |
| Cyan 800 | `#155e75` | Dark backgrounds |
| Cyan 900 | `#164e63` | Darkest shade |

---

## 📊 Status Colors

### Success: Green
| Color | Hex | Usage |
|-------|-----|-------|
| Success 500 | `#10b981` | Success messages, active states |
| Success 600 | `#059669` | Hover/pressed |
| Success 700 | `#047857` | Dark mode |

### Warning: Amber
| Color | Hex | Usage |
|-------|-----|-------|
| Warning 500 | `#f59e0b` | Warning messages, caution |
| Warning 600 | `#d97706` | Hover/pressed |
| Warning 700 | `#b45309` | Dark mode |

### Danger: Red
| Color | Hex | Usage |
|-------|-----|-------|
| Danger 500 | `#ef4444` | Error messages, delete actions |
| Danger 600 | `#dc2626` | Hover/pressed |
| Danger 700 | `#b91c1c` | Dark mode |

---

## 🎨 Gradient Combinations

### Primary Gradient
```css
background: linear-gradient(to right, #3b82f6, #2563eb);
```
**Usage**: Main buttons, primary actions

### Accent Gradient
```css
background: linear-gradient(to right, #a855f7, #9333ea);
```
**Usage**: Special features, premium elements

### Multi-Color Gradient
```css
background: linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #06b6d4 100%);
```
**Usage**: Logo text, hero sections, special highlights

### Header Gradient
```css
background: linear-gradient(to right, #3b82f6, #a855f7, #06b6d4);
```
**Usage**: Admin headers, feature sections

### Card Gradient
```css
background: linear-gradient(to bottom right, #3b82f6, #2563eb);
```
**Usage**: Stat cards, info boxes

---

## 🌈 Background Gradients

### Light Mode Main Background
```css
background: linear-gradient(
  to bottom right,
  #f9fafb,     /* gray-50 */
  rgba(239, 246, 255, 0.3),  /* blue-50 with opacity */
  rgba(250, 245, 255, 0.3)   /* purple-50 with opacity */
);
```

### Dark Mode Main Background
```css
background: linear-gradient(
  to bottom right,
  #111827,     /* gray-900 */
  rgba(30, 58, 138, 0.2),    /* blue-900 with opacity */
  rgba(88, 28, 135, 0.2)     /* purple-900 with opacity */
);
```

---

## 🎯 Component-Specific Colors

### Admin Panel Header
```css
/* Gradient */
background: linear-gradient(to bottom right, 
  #3b82f6,  /* primary-500 */
  #a855f7,  /* accent-600 */
  #06b6d4   /* secondary-500 */
);

/* Decorative elements */
rgba(255, 255, 255, 0.1) /* white with 10% opacity */
```

### Stat Cards
```css
/* Users - Blue */
from-blue-500 to-blue-600

/* Media - Purple */
from-purple-500 to-purple-600

/* Comments - Cyan */
from-cyan-500 to-cyan-600

/* Likes - Pink */
from-pink-500 to-pink-600
```

### Status Badges
```css
/* Active/Success */
background: #10b981 (success-500)
color: white

/* Inactive/Warning */
background: #f59e0b (warning-500)
color: white

/* Error/Danger */
background: #ef4444 (danger-500)
color: white
```

### Role Badges
```css
/* Admin */
background: #fee2e2 (red-100)
color: #991b1b (red-800)
border: #fecaca (red-200)

/* Co-Admin */
background: #f3e8ff (purple-100)
color: #6b21a8 (purple-800)
border: #e9d5ff (purple-200)

/* User */
background: #dbeafe (blue-100)
color: #1e40af (blue-800)
border: #bfdbfe (blue-200)
```

---

## 🖌️ Text Colors

### Light Mode
```css
/* Primary text */
color: #111827 (gray-900)

/* Secondary text */
color: #4b5563 (gray-600)

/* Muted text */
color: #9ca3af (gray-400)
```

### Dark Mode
```css
/* Primary text */
color: #f9fafb (gray-50)

/* Secondary text */
color: #d1d5db (gray-300)

/* Muted text */
color: #6b7280 (gray-500)
```

---

## 💫 Shadow Effects

### Glow Effect (Blue)
```css
box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
```

### Glow Effect (Purple)
```css
box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
```

### Glow Effect (Cyan)
```css
box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
```

### Combined Glow
```css
box-shadow: 
  0 0 20px rgba(59, 130, 246, 0.5),
  0 0 40px rgba(59, 130, 246, 0.8),
  0 0 60px rgba(168, 85, 247, 0.6);
```

### Glass Shadow
```css
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
```

---

## 🎭 Before & After

### Primary Color
- ❌ **Before**: Orange `#f97316`
- ✅ **After**: Blue `#3b82f6`

### Accent Color
- ❌ **Before**: Amber `#fbbf24`
- ✅ **After**: Purple `#a855f7`

### New Addition
- ✨ **Secondary**: Cyan `#06b6d4`

### Visual Impact
- **Before**: Warm, casual orange theme
- **After**: Cool, professional blue/purple theme
- **Improvement**: More trustworthy, modern, and enterprise-ready

---

## 📱 Usage Guidelines

### When to Use Each Color

#### Primary (Blue)
- Main navigation
- Primary buttons
- Links
- Active states
- Trust indicators

#### Accent (Purple)
- Special features
- Premium elements
- Highlighted content
- Creative sections
- Brand differentiation

#### Secondary (Cyan)
- Secondary actions
- Info badges
- Fresh content indicators
- Modern touches
- Energy and vitality

#### Success (Green)
- Success messages
- Active users
- Completed actions
- Positive feedback
- Growth indicators

#### Warning (Amber)
- Warning messages
- Pending actions
- Caution indicators
- Temporary states

#### Danger (Red)
- Error messages
- Delete actions
- Critical alerts
- Admin roles
- Stop actions

---

## 🎨 CSS Classes Reference

### Background Classes
```css
/* Solid backgrounds */
.bg-primary-500    /* #3b82f6 */
.bg-accent-500     /* #a855f7 */
.bg-secondary-500  /* #06b6d4 */

/* Gradient backgrounds */
.bg-gradient-to-r from-primary-500 to-accent-600
.bg-gradient-to-br from-blue-500 to-purple-600
```

### Text Classes
```css
/* Solid colors */
.text-primary-600   /* #2563eb */
.text-accent-600    /* #9333ea */
.text-secondary-600 /* #0891b2 */

/* Gradient text */
.gradient-text  /* Blue → Purple → Cyan gradient */
```

### Border Classes
```css
.border-primary-500
.border-accent-500
.border-secondary-500
```

### Shadow Classes
```css
.shadow-glow          /* Blue glow */
.shadow-glow-purple   /* Purple glow */
.shadow-glow-cyan     /* Cyan glow */
.shadow-glass         /* Frosted glass effect */
```

---

## 🚀 Quick Copy-Paste

### Logo Gradient Text
```html
<h1 className="text-2xl font-black gradient-text">
  ImageGallery
</h1>
```

### Primary Button
```html
<button className="bg-gradient-to-r from-primary-500 to-accent-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
  Click Me
</button>
```

### Stat Card
```html
<div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-xl text-white">
  <h3 className="text-lg font-semibold">Total Users</h3>
  <p className="text-4xl font-bold">1,234</p>
</div>
```

### Status Badge
```html
<span className="px-3 py-1.5 rounded-full text-sm font-bold bg-success-100 text-success-700">
  Active
</span>
```

---

**Last Updated**: $(Get-Date -Format "MMMM dd, yyyy")
**Theme Name**: Blue Horizon
**Version**: 3.0 Professional Edition