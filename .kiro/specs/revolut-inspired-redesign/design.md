# Design Document

## Overview

This design document outlines the comprehensive redesign of the MyDewbox application to create a modern, Revolut-inspired user experience. The redesign focuses on creating a premium, minimalist interface with smooth animations, intuitive navigation, and a mobile-first approach while maintaining all existing functionality.

### Design Philosophy

The redesign follows Revolut's design principles:
- **Minimalism**: Clean interfaces with purposeful whitespace
- **Premium Feel**: High-quality visuals with subtle depth and polish
- **Fluid Motion**: Smooth, natural animations that enhance usability
- **Mobile-First**: Optimized for mobile with progressive enhancement for desktop
- **Clarity**: Clear visual hierarchy and intuitive information architecture

### Technology Stack

- **Frontend Framework**: React 19 with Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: Framer Motion for advanced animations
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Yup validation
- **Icons**: Lucide React (consistent with Revolut's icon style)
- **Routing**: React Router DOM v7

## Architecture

### Component Architecture

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Navigation/
│   │   └── Skeleton/
│   ├── layout/          # Layout components
│   │   ├── AppLayout/
│   │   ├── AuthLayout/
│   │   └── DashboardLayout/
│   └── features/        # Feature-specific components
│       ├── Dashboard/
│       ├── Transactions/
│       ├── Profile/
│       └── Contribute/
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API services
├── store/               # Zustand stores
├── styles/              # Global styles and design tokens
└── utils/               # Utility functions
```

### Design Token System

Design tokens will be defined in Tailwind config and CSS variables for consistency:

```javascript
// tailwind.config.js
theme: {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ... Revolut-inspired blue scale
      900: '#0c4a6e'
    },
    neutral: {
      // Grayscale for backgrounds and text
    },
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b'
  },
  spacing: {
    // 8px grid system
  },
  borderRadius: {
    'sm': '8px',
    'md': '12px',
    'lg': '16px',
    'xl': '20px'
  }
}
```


## Components and Interfaces

### 1. Design System Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}
```

**Design Specifications**:
- Primary: Gradient background (blue-600 to indigo-600), white text
- Secondary: Neutral background, dark text
- Outline: Transparent with border, colored text
- Ghost: Transparent, colored text on hover
- Border radius: 12px
- Padding: sm (8px 16px), md (12px 24px), lg (16px 32px)
- Hover: Scale 1.02, brightness increase
- Active: Scale 0.98
- Transition: 150ms ease-in-out

#### Card Component
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: ReactNode;
}
```

**Design Specifications**:
- Default: White background, subtle border
- Elevated: White background, shadow-lg
- Outlined: Transparent, border only
- Glass: Semi-transparent with backdrop blur
- Border radius: 16px
- Shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
- Hover (if hoverable): Shadow-xl, translate-y -2px

#### Input Component
```typescript
interface InputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  type: string;
  placeholder?: string;
  disabled?: boolean;
}
```

**Design Specifications**:
- Background: White with subtle gray tint
- Border: 1px solid gray-200
- Focus: 2px ring blue-500, border transparent
- Error: Border red-500, ring red-500
- Icon: Positioned left, gray-500
- Label: Above input, gray-700, font-medium
- Error text: Below input, red-500, text-sm
- Border radius: 12px
- Padding: 12px 16px (48px left if icon)


### 2. Navigation System

#### Mobile Navigation (Bottom Bar)
**Design Specifications**:
- Position: Fixed bottom, full width
- Height: 64px
- Background: White with backdrop blur
- Border top: 1px solid gray-200
- Items: 4-5 navigation items
- Active indicator: Blue-600 color, scale 1.1
- Icons: 24px, centered above label
- Labels: 12px, gray-600 (active: blue-600)
- Safe area: Padding bottom for iOS notch

**Navigation Items**:
1. Home (Home icon)
2. Transactions (Receipt icon)
3. Contribute (Plus circle icon)
4. Profile (User icon)

#### Desktop Navigation (Sidebar)
**Design Specifications**:
- Position: Fixed left
- Width: 280px (expanded), 80px (collapsed)
- Background: White
- Border right: 1px solid gray-200
- Logo: Top, 48px height
- Items: Vertical list with icons and labels
- Active indicator: Blue-600 background, rounded-lg
- Hover: Gray-100 background
- Collapse toggle: Bottom of sidebar

### 3. Authentication Flow

#### Sign In Page
**Layout**:
- Split screen on desktop (50/50)
- Left: Animated carousel with app features
- Right: Sign-in form
- Mobile: Full-screen form with logo at top

**Form Design**:
- Card: Glass variant, centered
- Logo: Top center, 64px
- Title: "Welcome back", 32px, bold
- Inputs: Email, Password with show/hide toggle
- Remember me: Checkbox with label
- Primary CTA: "Sign In" button, full width
- Secondary actions: "Forgot password?", "Create account"
- Social auth: Icon buttons below divider

#### Subscribe To (Sign Up) Page
**Layout**: Similar to Sign In
**Form Fields**:
- First name, Last name
- Email
- Phone number (with country code selector)
- Password (with strength indicator)
- Confirm password
- Terms acceptance checkbox
- Primary CTA: "Create Account"

#### First Contribute (Onboarding)
**Layout**: Multi-step wizard
**Steps**:
1. Welcome screen with animation
2. Contribution type selection (cards)
3. Amount input with currency selector
4. Payment method selection
5. Confirmation screen

**Design**:
- Progress indicator: Top, 4px height, animated
- Step cards: Large, centered, with illustrations
- Navigation: "Back" and "Continue" buttons
- Skip option: Top right for optional steps


### 4. Dashboard Interface

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Header (Greeting + Avatar)              │
├─────────────────────────────────────────┤
│ Balance Cards (2 columns)               │
├─────────────────────────────────────────┤
│ Quick Actions (3 buttons)               │
├─────────────────────────────────────────┤
│ Info Carousel                           │
├─────────────────────────────────────────┤
│ Recent Transactions (5 items)           │
└─────────────────────────────────────────┘
```

**Header Section**:
- Background: Gradient (blue-600 to purple-700)
- Padding: 24px
- Border radius: 16px
- Greeting: "Welcome back, {name}!", 24px, bold, white
- Subtitle: "Here's your financial overview", 14px, blue-100
- Avatar: 64px circle, right side, white border

**Balance Cards**:
- Grid: 2 columns on desktop, 1 on mobile
- Card design: White, elevated variant
- Icon: Top left, colored background circle
- Label: Below icon, 16px, gray-800
- Amount: Large, 32px, bold, gray-900
- Trend indicator: Top right, small icon
- Subtitle: Bottom, 12px, colored text

**Quick Actions**:
- Layout: 3 equal-width buttons
- Design: Primary variant, different colors
- Icons: Left of text
- Responsive: Stack on mobile

**Info Carousel**:
- Auto-rotate: 4 seconds
- Transition: Slide with fade
- Indicators: Dots below, clickable
- Card design: Gradient backgrounds
- Content: Title (20px, bold) + Description (14px)

**Recent Transactions**:
- Container: White card, elevated
- Header: "Recent Transactions", 20px, bold
- List: 5 items, scrollable
- Item design:
  - Icon: Left, colored circle (green/red)
  - Description: Primary text, 14px, gray-800
  - Date: Secondary text, 12px, gray-500
  - Amount: Right, 16px, bold, colored
- Footer: "View All" link, centered

### 5. Transaction Interface

#### Transaction Options Grid
**Layout**:
- Grid: 2x2 on desktop, 1 column on mobile
- Gap: 16px
- Cards: White, elevated, hoverable

**Option Card Design**:
- Padding: 24px
- Icon: Left, gradient background circle (48px)
- Label: Right of icon, 16px, medium
- Hover: Scale 1.02, shadow-xl
- Active: Ring-2 blue-500

**Transaction Types**:
1. Fund Wallet (Wallet icon, blue gradient)
2. Withdraw (Bank icon, green gradient)
3. Pay to Bank (Exchange icon, purple gradient)
4. Send to User (Users icon, orange gradient)

#### Transaction Forms
**Layout**:
- Animated entrance: Slide up + fade in
- Container: Glass card, centered
- Max width: 500px
- Back button: Top left

**Form Design**:
- Title: Icon + text, gradient text
- Fields: Stacked, 16px gap
- Input style: Consistent with Input component
- Bank selector: Dropdown with search
- Amount input: Large text, prominent
- PIN input: Password with dots
- Actions: Horizontal buttons at bottom

**Form Variants**:
1. **Fund Wallet**: Email, Amount, Paystack button
2. **Withdraw**: Bank, Account, Amount, PIN, Verify button
3. **Pay to Bank**: Bank, Account, Amount, PIN, Verify button
4. **Send to User**: Email, Amount, Message (optional), PIN

**Validation**:
- Real-time: On blur
- Error display: Below field, red text, icon
- Success: Green checkmark, success message
- Loading: Spinner in button, disabled state


### 6. Profile Interface

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Cover Image (Gradient)                  │
│         ┌─────────┐                     │
│         │ Avatar  │                     │
├─────────┴─────────┴─────────────────────┤
│ Name + Join Date                        │
├─────────────────────────────────────────┤
│ Profile Form (Sections)                 │
│  - Personal Information                 │
│  - Contact Details                      │
│  - Address                              │
│  - Emergency Contact                    │
├─────────────────────────────────────────┤
│ Save Button                             │
└─────────────────────────────────────────┘
```

**Cover Section**:
- Height: 128px
- Background: Gradient (blue-600 to indigo-600)
- Avatar: 128px circle, centered, overlapping
- Border: 4px white
- Upload overlay: On hover, semi-transparent

**Profile Info**:
- Name: 24px, bold, centered, gradient text
- Join date: 14px, gray-600, centered, with calendar icon

**Form Sections**:
- Container: White card, elevated
- Section spacing: 32px vertical gap
- Field layout: Single column, stacked
- Icon: Left of each input, gray-500
- Labels: Placeholder style, inside input
- Required indicator: Red asterisk

**Field Groups**:
1. **Personal**: First name, Last name, Gender, DOB
2. **Contact**: Mobile, Alternate phone, Email
3. **Address**: Address, City, State, Country
4. **Financial**: Currency preference
5. **Emergency**: Next of kin name, Next of kin contact
6. **Referral**: Referral code, Referral phone

**Save Button**:
- Position: Bottom, full width
- Design: Primary variant, gradient
- Icon: Save icon left
- Loading state: Spinner, "Saving..." text
- Success feedback: Toast notification

### 7. Contribute Interface

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Title                                   │
├─────────────────────────────────────────┤
│ Contribution Type Cards (3 columns)     │
├─────────────────────────────────────────┤
│ Contribution Form                       │
│  - Email                                │
│  - PIN                                  │
│  - Currency Selector                    │
│  - Amount                               │
│  - Amount in NGN (calculated)           │
├─────────────────────────────────────────┤
│ Contribute Button                       │
└─────────────────────────────────────────┘
```

**Contribution Type Cards**:
- Grid: 3 columns on desktop, 1 on mobile
- Card design: Colored backgrounds (purple, blue, gray)
- Content: Type label + Amount (00)
- Border radius: 12px
- Padding: 16px

**Form Design**:
- Container: Glass card, centered
- Max width: 500px
- Title: Gradient text, 24px, bold
- Fields: Stacked with 16px gap

**Currency Selector**:
- Dropdown: Searchable
- Options: All supported currencies from API
- Loading state: "Loading..." option

**Amount Display**:
- Primary amount: User's selected currency
- Converted amount: NGN (read-only, gray background)
- Real-time conversion: Updates on currency/amount change

**Contribute Button**:
- Design: Gradient (purple-600 to indigo-600)
- Full width
- Loading state: Spinner animation
- Success: Redirect to confirmation screen


## Data Models

### User/Subscriber Model
```typescript
interface Subscriber {
  id: string;
  email: string;
  firstname: string;
  surname: string;
  mobile: string;
  alternatePhone?: string;
  address1: string;
  city?: string;
  state: string;
  country: string;
  dob: string;
  gender?: string;
  currency?: string;
  balance: number;           // Main balance
  available_balance: number; // Esusu balance
  profileImage?: string;
  referral?: string;
  referralPhone?: string;
  nextOfKinName?: string;
  nextOfKinContact?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Transaction Model
```typescript
interface Transaction {
  id: string;
  type: 'CONTRIBUTION' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  category?: string;
  recipientEmail?: string;
  bankCode?: string;
  accountNumber?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Bank Model
```typescript
interface Bank {
  code: string;
  name: string;
}
```

### API Response Wrapper
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

## Error Handling

### Error Display Strategy

**Toast Notifications**:
- Position: Top right
- Duration: 5 seconds
- Types: Success (green), Error (red), Warning (yellow), Info (blue)
- Animation: Slide in from right + fade
- Dismissible: Click or auto-dismiss

**Inline Errors**:
- Form validation: Below field, red text, icon
- API errors: Below form, red card with icon
- Network errors: Full-page overlay with retry button

**Error States**:
1. **Loading Error**: Skeleton loaders with error message
2. **No Data**: Empty state with illustration and CTA
3. **Network Error**: Offline indicator with retry
4. **Validation Error**: Field-level with clear message
5. **Server Error**: User-friendly message with support link

### Error Recovery

**Retry Mechanisms**:
- Automatic retry: 1 attempt for failed queries
- Manual retry: Button in error state
- Refresh: Pull-to-refresh on mobile

**Fallback UI**:
- Skeleton loaders during loading
- Placeholder images for missing avatars
- Default values for missing data
- Graceful degradation for unsupported features


## Testing Strategy

### Component Testing

**Unit Tests**:
- UI Components: Button, Card, Input, Modal
- Test cases: Rendering, props, variants, interactions
- Tools: Vitest + React Testing Library

**Integration Tests**:
- Form flows: Sign in, sign up, profile update
- Navigation: Route transitions, protected routes
- API integration: Mock API responses

### Visual Testing

**Responsive Testing**:
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)
- Devices: iPhone SE, iPhone 12, iPad, Desktop
- Orientation: Portrait and landscape

**Browser Testing**:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

### Performance Testing

**Metrics**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Optimization Strategies**:
- Code splitting: Route-based
- Lazy loading: Images and components
- Memoization: Expensive computations
- Debouncing: Search and input handlers

### Accessibility Testing

**WCAG 2.1 Level AA Compliance**:
- Keyboard navigation: All interactive elements
- Screen reader: ARIA labels and roles
- Color contrast: 4.5:1 for text, 3:1 for UI
- Focus indicators: Visible on all focusable elements
- Form labels: Associated with inputs

**Testing Tools**:
- axe DevTools
- Lighthouse accessibility audit
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver)

## Animation Specifications

### Page Transitions
```typescript
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};
```

### Component Animations

**Button Hover**:
- Scale: 1.02
- Duration: 150ms
- Easing: ease-in-out

**Button Active**:
- Scale: 0.98
- Duration: 100ms

**Card Hover**:
- Transform: translateY(-4px)
- Shadow: Increase to shadow-xl
- Duration: 200ms
- Easing: ease-out

**Modal Enter**:
- Backdrop: Fade in (opacity 0 to 1)
- Content: Scale (0.95 to 1) + Fade in
- Duration: 300ms
- Easing: ease-out

**Modal Exit**:
- Backdrop: Fade out
- Content: Scale (1 to 0.95) + Fade out
- Duration: 200ms
- Easing: ease-in

**List Item Stagger**:
- Delay: 50ms between items
- Animation: Fade in + Slide up
- Duration: 300ms per item

**Skeleton Loader**:
- Animation: Pulse (opacity 0.5 to 1)
- Duration: 1.5s
- Iteration: Infinite
- Easing: ease-in-out


## Responsive Design

### Breakpoint Strategy

```javascript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
};
```

### Layout Adaptations

**Mobile (< 768px)**:
- Navigation: Bottom bar (fixed)
- Cards: Single column, full width
- Typography: Smaller scale (base 14px)
- Spacing: Reduced padding (16px)
- Forms: Full width inputs
- Modals: Full screen
- Images: Optimized for mobile bandwidth

**Tablet (768px - 1024px)**:
- Navigation: Bottom bar or collapsible sidebar
- Cards: 2 columns
- Typography: Medium scale (base 15px)
- Spacing: Standard padding (20px)
- Forms: Max width 600px, centered
- Modals: Centered with max width

**Desktop (> 1024px)**:
- Navigation: Expanded sidebar (280px)
- Cards: 2-3 columns
- Typography: Full scale (base 16px)
- Spacing: Generous padding (24px)
- Forms: Max width 500px, centered
- Modals: Centered with max width 600px
- Hover states: Enabled

### Touch Targets

**Minimum Sizes**:
- Buttons: 44px x 44px
- Links: 44px x 44px
- Form inputs: 48px height
- Navigation items: 56px height
- Icon buttons: 48px x 48px

### Typography Scale

**Mobile**:
- h1: 24px / 1.2 / bold
- h2: 20px / 1.3 / bold
- h3: 18px / 1.4 / semibold
- body: 14px / 1.5 / normal
- small: 12px / 1.4 / normal

**Desktop**:
- h1: 32px / 1.2 / bold
- h2: 24px / 1.3 / bold
- h3: 20px / 1.4 / semibold
- body: 16px / 1.5 / normal
- small: 14px / 1.4 / normal

## Theme System

### Light Theme (Default)

**Colors**:
- Background: #ffffff
- Surface: #f9fafb
- Text primary: #111827
- Text secondary: #6b7280
- Border: #e5e7eb
- Primary: #2563eb
- Success: #10b981
- Error: #ef4444
- Warning: #f59e0b

### Dark Theme (Optional)

**Colors**:
- Background: #0f172a
- Surface: #1e293b
- Text primary: #f1f5f9
- Text secondary: #94a3b8
- Border: #334155
- Primary: #3b82f6
- Success: #22c55e
- Error: #f87171
- Warning: #fbbf24

**Implementation**:
- CSS variables for theme colors
- Toggle in profile settings
- Persist preference in localStorage
- Smooth transition between themes (300ms)

## Performance Optimization

### Code Splitting

**Route-based splitting**:
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Profile = lazy(() => import('./pages/Profile'));
const Contribute = lazy(() => import('./pages/Contribute'));
```

**Component-based splitting**:
- Heavy components (charts, rich editors)
- Modal content
- Third-party integrations (Paystack)

### Image Optimization

**Strategies**:
- WebP format with fallback
- Responsive images with srcset
- Lazy loading below fold
- Blur placeholder during load
- CDN delivery for static assets

### Bundle Optimization

**Techniques**:
- Tree shaking: Remove unused code
- Minification: Terser for production
- Compression: Gzip/Brotli
- Vendor splitting: Separate vendor bundle
- Dynamic imports: Load on demand

### Caching Strategy

**React Query**:
- Stale time: 5 minutes for user data
- Cache time: 10 minutes
- Refetch on window focus: Disabled for static data
- Retry: 1 attempt for failed queries

**Service Worker** (Future enhancement):
- Cache static assets
- Offline fallback page
- Background sync for failed requests

## Security Considerations

### Authentication

**Token Management**:
- JWT stored in httpOnly cookie (preferred) or localStorage
- Token refresh mechanism
- Automatic logout on expiration
- Secure token transmission (HTTPS only)

### Input Validation

**Client-side**:
- Yup schema validation
- Real-time feedback
- Sanitize user inputs
- Prevent XSS attacks

**Server-side**:
- Validate all inputs
- Rate limiting
- CSRF protection
- SQL injection prevention

### Sensitive Data

**Protection**:
- PIN: Never logged or displayed
- Passwords: Masked input, strength indicator
- Bank details: Masked display (last 4 digits)
- API keys: Environment variables only

## Migration Strategy

### Phase 1: Design System Setup
- Create design tokens
- Build UI component library
- Set up Storybook for component documentation
- Implement theme system

### Phase 2: Layout Refactor
- Implement new navigation system
- Create layout components
- Update routing structure
- Add page transitions

### Phase 3: Page Redesign
- Dashboard: New layout and components
- Transactions: Redesigned interface
- Profile: Enhanced form design
- Contribute: Improved flow

### Phase 4: Polish & Optimization
- Animation refinement
- Performance optimization
- Accessibility audit
- Cross-browser testing
- Mobile optimization

### Phase 5: Cleanup
- Remove old components
- Update documentation
- Code review and refactoring
- Final testing

## Design Decisions & Rationales

### Why Framer Motion?
- Declarative animation API
- Spring physics for natural motion
- Layout animations out of the box
- Gesture support for mobile
- Small bundle size (< 30kb)

### Why Tailwind CSS?
- Utility-first approach matches Revolut's design
- Rapid prototyping
- Consistent spacing and colors
- Excellent responsive utilities
- Tree-shaking for small production bundle

### Why Bottom Navigation on Mobile?
- Thumb-friendly on large phones
- Industry standard (iOS, Android)
- Revolut uses bottom navigation
- Better reachability than top navigation

### Why Card-Based Layout?
- Modern, clean aesthetic
- Clear content separation
- Easy to scan
- Works well on all screen sizes
- Matches Revolut's design language

### Why Gradient Buttons?
- Premium, modern feel
- Visual hierarchy
- Matches Revolut's brand
- Draws attention to primary actions
- Creates depth without shadows
