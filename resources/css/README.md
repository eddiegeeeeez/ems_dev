# CSS Organization Structure

## Overview
This folder contains all the organized CSS files for the EMS System, organized by functionality and component type for easy navigation and maintenance.

## Folder Structure

```
resources/css/
├── index.css                 # Master file that imports all CSS
├── app.css                   # Original Tailwind config (kept for reference)
├── components/               # Component-specific styles
│   ├── header.css           # Header navigation bar styles
│   ├── sidebar.css          # Sidebar navigation styles
│   ├── buttons.css          # Button component styles
│   ├── forms.css            # Form elements and input styles
│   ├── cards.css            # Card layout component styles
│   └── profile-banner.css   # User profile banner styles
├── animations/              # Animation definitions
│   ├── sidebar.css          # Sidebar animation keyframes
│   └── general.css          # General reusable animations
├── layouts/                 # Layout structures
│   └── main.css             # Main layout grid and structure
└── utilities/               # Utility and helper styles
    ├── helpers.css          # Color, spacing, sizing utilities
    └── typography.css       # Typography and text utilities
```

## File Descriptions

### Components (`/components/`)

**header.css**
- Hamburger menu button styling
- Header layout and spacing
- Logo and branding styles
- Notification button
- User dropdown menu

**sidebar.css**
- Desktop and mobile sidebar layouts
- Menu items and navigation links
- Dropdown sections
- User footer section
- Active state styling

**buttons.css**
- Primary, secondary, outline, ghost button styles
- Size variants (sm, md, lg)
- Icon button styling
- Button groups
- Disabled state

**forms.css**
- Input, textarea, select styling
- Checkboxes and radio buttons
- Form labels and help text
- Error and success states
- Form groups

**cards.css**
- Card container styles
- Card header, body, footer sections
- Card hover effects
- Stat cards styling
- Card grids and layouts

**profile-banner.css**
- User profile header banner
- Avatar styling
- User information display
- Decorative shapes and overlays
- Role badge styling

### Animations (`/animations/`)

**sidebar.css**
- Sidebar slide in/out animations
- Menu dropdown animations
- Chevron rotation animations
- Overlay fade effects

**general.css**
- Fade in/out animations
- Scale animations
- Bounce and pulse effects
- Shake animation
- Spin/rotate animations

### Layouts (`/layouts/`)

**main.css**
- Main container layout
- Header positioning
- Sidebar positioning
- Main content area
- Scrollbar styling
- Responsive behavior

### Utilities (`/utilities/`)

**helpers.css**
- Color utility classes
- Spacing utilities
- Sizing utilities
- Flex layout utilities
- Shadow utilities
- Display utilities
- Cursor and opacity utilities

**typography.css**
- Font size classes
- Font weight classes
- Letter spacing
- Text alignment
- Line height
- Text truncation and line clamping

## Usage

### How to Import in HTML/Blade Templates

```html
<!-- In your <head> -->
<link rel="stylesheet" href="{{ asset('css/index.css') }}">
```

### How to Add New Styles

1. **For component-specific styles**: Add to the appropriate file in `/components/`
2. **For new animations**: Create or add to files in `/animations/`
3. **For layout changes**: Update `/layouts/main.css`
4. **For utilities**: Add to `/utilities/` files
5. **Update `/index.css`** with new imports if creating new files

### Example: Adding a New Component

1. Create `resources/css/components/new-component.css`
2. Add your component styles
3. Import in `resources/css/index.css`:
   ```css
   @import "components/new-component.css";
   ```

## Color System

**Primary Colors:**
- Primary (Red): `#c41e3a` - Brand color
- Secondary (Green): `#4caf50` - Success/approval
- Danger: `#ef4444` - Errors
- Warning: `#f59e0b` - Warnings
- Success: `#10b981` - Success states
- Info: `#3b82f6` - Information

## Responsive Breakpoints

- Mobile: Default (0px and up)
- Small (sm): 640px
- Medium (md): 768px
- Large (lg): 1024px
- Extra Large (xl): 1280px

## CSS Naming Conventions

- Classes use kebab-case: `.button-primary`, `.card-header`
- BEM-inspired structure for complex components
- Utility classes use descriptive names: `.flex-center`, `.shadow-lg`
- Animation classes use descriptive names: `.fade-in`, `.slide-left`

## Performance Tips

1. Use utility classes from `helpers.css` for common styles
2. Leverage CSS variables for theme consistency
3. Keep component-specific styles in their respective files
4. Use animations sparingly for better performance
5. Combine related rules in single declarations

## Troubleshooting

**Issue: Styles not applying**
- Check if component CSS is imported in `index.css`
- Verify Tailwind is properly configured
- Check browser DevTools for CSS specificity issues

**Issue: Animations not playing**
- Ensure animation CSS is imported
- Check animation names match element classes
- Verify animation duration and timing function

**Issue: Responsive design not working**
- Check breakpoint classes (md:, lg:, etc.)
- Ensure media queries are in layout CSS
- Test with browser DevTools device mode
