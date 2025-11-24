# UI Component Library

Revolut-inspired UI components built with React, Tailwind CSS, and Framer Motion.

## Components

### Button

A versatile button component with multiple variants, sizes, and loading states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `fullWidth`: boolean (default: false)
- `loading`: boolean (default: false)
- `disabled`: boolean (default: false)
- `icon`: ReactNode - Icon to display on the left
- `onClick`: Function - Click handler

**Example:**
```jsx
import { Button } from './components/ui';
import { Save } from 'lucide-react';

<Button variant="primary" size="md" icon={<Save size={20} />}>
  Save Changes
</Button>

<Button variant="secondary" loading>
  Loading...
</Button>
```

### Card

A flexible card component with different variants and optional hover animations.

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'glass' (default: 'default')
- `padding`: 'sm' | 'md' | 'lg' (default: 'md')
- `hoverable`: boolean (default: false)
- `onClick`: Function - Click handler

**Example:**
```jsx
import { Card } from './components/ui';

<Card variant="elevated" padding="lg" hoverable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Input

An input component with label, error handling, icon support, and password visibility toggle.

**Props:**
- `label`: string - Input label
- `error`: string - Error message to display
- `icon`: ReactNode - Icon to display on the left
- `type`: 'text' | 'email' | 'password' | 'number' | 'date' (default: 'text')
- `placeholder`: string
- `disabled`: boolean (default: false)
- `required`: boolean (default: false)

**Example:**
```jsx
import { Input } from './components/ui';
import { Mail } from 'lucide-react';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  icon={<Mail size={20} />}
  error="Invalid email address"
  required
/>
```

### Modal

A modal component with backdrop, animations, and keyboard support.

**Props:**
- `isOpen`: boolean - Whether modal is open
- `onClose`: Function - Function to call when modal should close
- `title`: string - Modal title
- `showCloseButton`: boolean (default: true)
- `closeOnBackdropClick`: boolean (default: true)
- `closeOnEsc`: boolean (default: true)

**Example:**
```jsx
import { Modal, Button } from './components/ui';
import { useState } from 'react';

const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex gap-2 mt-3">
    <Button variant="primary">Confirm</Button>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
  </div>
</Modal>
```

### Skeleton

Loading placeholder components with pulse animation.

**Props:**
- `shape`: 'rectangle' | 'circle' (default: 'rectangle')
- `width`: string - CSS width value (default: '100%')
- `height`: string - CSS height value (default: '20px')

**Additional Components:**
- `SkeletonText`: Multiple skeleton lines for text content
- `SkeletonCard`: Skeleton for card content with optional avatar
- `SkeletonList`: Multiple skeleton items in a list

**Example:**
```jsx
import { Skeleton, SkeletonText, SkeletonCard, SkeletonList } from './components/ui';

<Skeleton width="200px" height="24px" />
<Skeleton shape="circle" width="64px" height="64px" />

<SkeletonText lines={3} />

<SkeletonCard showAvatar />

<SkeletonList items={5} showAvatar />
```

### Toggle

A toggle switch component for boolean settings with smooth animations.

**Props:**
- `checked`: boolean (default: false) - Whether the toggle is on
- `onChange`: Function - Callback when toggle state changes
- `disabled`: boolean (default: false)
- `label`: string - Label text for the toggle
- `description`: string - Optional description text
- `className`: string - Additional CSS classes

**Example:**
```jsx
import { Toggle } from './components/ui';
import { useState } from 'react';

const [enabled, setEnabled] = useState(false);

<Toggle
  checked={enabled}
  onChange={setEnabled}
  label="Email Notifications"
  description="Receive updates and alerts via email"
/>

<Toggle
  checked={darkMode}
  onChange={setDarkMode}
  label="Dark Mode"
  disabled
/>
```

## Design Tokens

All components use the design tokens defined in `tailwind.config.cjs` and `src/index.css`:

- **Colors**: Primary, neutral, success, error, warning, info
- **Spacing**: 8px grid system
- **Border Radius**: 8px (sm), 12px (md), 16px (lg), 20px (xl)
- **Shadows**: Subtle elevation for depth
- **Typography**: Inter font with clear hierarchy
- **Animations**: Smooth transitions with Framer Motion

## Animations

All interactive components include smooth animations:

- **Button**: Hover (scale 1.02), Active (scale 0.98)
- **Card**: Hover (translateY -4px, shadow-xl)
- **Modal**: Enter/exit with scale and fade
- **Skeleton**: Pulse animation (1.5s infinite)

## Accessibility

All components follow accessibility best practices:

- Keyboard navigation support
- Focus indicators (2px ring)
- ARIA labels and roles
- Color contrast compliance
- Screen reader support
