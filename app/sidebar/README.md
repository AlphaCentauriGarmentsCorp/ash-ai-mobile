# Sidebar Module

This sidebar module implements the navigation sidebar from the UI/UX design, providing access to all main sections of the application.

## Structure

```
app/sidebar/
├── index.tsx                    # Main sidebar component with modal wrapper
├── components/
│   ├── SidebarHeader.tsx        # User profile section with admin badge
│   └── SidebarMenu.tsx          # Navigation menu with sections
└── README.md                    # This file
```

## Components Overview

### Sidebar (index.tsx)
- Modal-based overlay sidebar
- Slides in from the left
- Semi-transparent backdrop
- Touch outside to close functionality
- 280px width for optimal mobile experience

### SidebarHeader
- **User Profile Card**: White rounded card with user info
- **User Avatar**: Placeholder avatar with person icon
- **User Name**: "Kurt Russel Q. Santos"
- **Admin Badge**: Green status dot with "Admin" text
- **Dropdown Arrow**: For future profile menu expansion

### SidebarMenu
- **Home Section**:
  - Dashboard (home icon)
  - Clients (people icon)
  - Reefer (shirt icon)
  - Sorbetes (ice cream icon)

- **Daily Operations Section**:
  - Orders (receipt icon)
  - Design and Approval (color palette icon)
  - Cutting Operations (cut icon)
  - Printing Operations (print icon)
  - Material Preparation (cube icon)

## Features

- **Responsive Design**: Optimized for mobile devices
- **Clean Navigation**: Clear section separation
- **Icon Integration**: Ionicons for consistent visual language
- **Touch Feedback**: Proper touch states and feedback
- **Scrollable Content**: Handles overflow gracefully
- **Modal Presentation**: Smooth slide animation

## Integration

The sidebar is integrated with the DashboardHeader component:
- **Trigger**: Menu button in the top-left corner
- **State Management**: Uses React useState for visibility
- **Close Methods**: 
  - Tap backdrop
  - Select menu item
  - Hardware back button (Android)

## Usage

```typescript
import Sidebar from '../sidebar';

// In your component
const [showSidebar, setShowSidebar] = useState(false);

<Sidebar 
  visible={showSidebar} 
  onClose={() => setShowSidebar(false)} 
/>
```

## Styling

- **Background**: Dark blue (#1e3a5f) matching the header
- **Typography**: White text with proper hierarchy
- **Spacing**: Consistent padding and margins
- **Interactive Elements**: Proper touch targets (44px minimum)

The sidebar provides a clean, accessible navigation experience that matches the overall design system of the application.