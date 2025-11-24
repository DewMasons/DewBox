# Navigation Components

This directory contains the responsive navigation system for the MyDewbox application, inspired by Revolut's design.

## Components

### MobileBottomNav
A fixed bottom navigation bar for mobile devices (< 768px).

**Features:**
- Fixed bottom positioning with backdrop blur
- 4 navigation items: Home, Transactions, Contribute, Profile
- Active state highlighting with blue-600 color
- Scale animation on active items (1.1x)
- 24px icons with 12px labels
- Safe area padding for iOS notch support
- Border-top styling for visual separation

**Usage:**
```jsx
import { MobileBottomNav } from './components/navigation';

<MobileBottomNav />
```

### DesktopSidebar
A fixed left sidebar navigation for desktop devices (≥ 768px).

**Features:**
- Fixed left positioning (280px expanded, 80px collapsed)
- Logo at top (48px height)
- Vertical navigation list with icons and labels
- Active state with blue-600 background and rounded corners
- Hover state with gray-100 background
- Collapse/expand functionality with smooth animations
- Logout button at bottom
- Smooth transitions between collapsed/expanded states

**Usage:**
```jsx
import { DesktopSidebar } from './components/navigation';

<DesktopSidebar />
```

### PageTransition
A wrapper component that adds smooth page transition animations using Framer Motion.

**Features:**
- Fade-in and slide-up animation (400ms) on page enter
- Fade-out and slide-down animation (300ms) on page exit
- Ease-in-out easing for smooth transitions
- Works with React Router's location-based animations

**Usage:**
```jsx
import { PageTransition } from './components/navigation';

<Route
  path="/dashboard"
  element={
    <PageTransition>
      <Dashboard />
    </PageTransition>
  }
/>
```

## Implementation Details

### Responsive Behavior
- **Mobile (< 768px)**: Bottom navigation bar is visible, sidebar is hidden
- **Desktop (≥ 768px)**: Sidebar is visible, bottom navigation is hidden
- Main content area adjusts margin-left to accommodate sidebar width

### Navigation Items
All navigation components use the same navigation structure:
1. Home (`/dashboard`) - Home icon
2. Transactions (`/dashboard/transactions`) - Receipt icon
3. Contribute (`/dashboard/contribute`) - PlusCircle icon
4. Profile (`/dashboard/profile`) - User icon

### Animations
- **Button hover**: Scale 1.02, 150ms
- **Active state**: Scale 1.1 (mobile), blue-600 background (desktop)
- **Page transitions**: 400ms enter, 300ms exit
- **Sidebar collapse**: 300ms smooth width transition

### Accessibility
- Proper ARIA labels for icon-only buttons
- Keyboard navigation support via NavLink
- Focus indicators on interactive elements
- Semantic HTML structure

## Design Tokens Used

### Colors
- Active: `blue-600`
- Inactive: `gray-600` (mobile), `gray-700` (desktop)
- Hover: `gray-100`
- Background: `white/80` with backdrop blur
- Border: `gray-200`

### Spacing
- Mobile nav height: `64px` (16 in Tailwind)
- Sidebar width: `280px` (expanded), `80px` (collapsed)
- Icon size: `24px`
- Label size: `12px` (mobile), `16px` (desktop)

### Effects
- Backdrop blur: `md` (12px)
- Border radius: `lg` (16px) for nav items
- Shadow: Subtle on active items

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:
- **4.1**: Bottom navigation bar for mobile with 4-5 primary sections
- **4.2**: Sidebar navigation for desktop with collapsible menu
- **4.3**: Active section highlighting with visual feedback
- **4.4**: Navigation icons with text labels
- **4.5**: Navigation state maintenance
- **2.1**: Smooth page transition animations
- **2.5**: Ease-in-out easing for natural motion
- **10.1**: Responsive layout adaptation at 768px breakpoint
