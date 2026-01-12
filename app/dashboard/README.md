# Dashboard Module

This dashboard module implements the UI/UX design provided, featuring a comprehensive business management interface.

## Structure

```
app/dashboard/
├── index.tsx                    # Main dashboard screen
├── components/
│   ├── DashboardHeader.tsx      # Top navigation with menu and user actions
│   ├── QuickActions.tsx         # View Orders and Clients quick access
│   ├── StatsCards.tsx           # Revenue, Orders, Users, Clients metrics
│   ├── Manufacturing.tsx        # Production stages navigation
│   ├── ExternalOperations.tsx   # Delivery and Subcontract management
│   ├── TopSellingProducts.tsx   # Product analytics and inventory
│   └── WorkDistribution.tsx     # Employee data visualization
└── README.md                    # This file
```

## Components Overview

### DashboardHeader
- Navigation menu button
- Dashboard title with icon
- User profile and list actions

### QuickActions
- Fast access to View Orders and Clients
- Progress indicator
- Clean card-based layout

### StatsCards
- Total Revenue (₱10,000.00) with growth indicator
- Active Orders (335) with change indicator  
- Active Users (25) with decline indicator
- Total Clients (124) with growth indicator

### Manufacturing
- Production stage navigation (Cutting, Packer, Printing, etc.)
- Quality Control (QA) highlighted as selected
- Arrow indicators for navigation

### ExternalOperations
- Delivery management
- Subcontract task management
- Icon-based interface

### TopSellingProducts
- Reefer clothing inventory with stock levels
- Status indicators (available, low stock, urgent)
- Sorbetes analytics for apparel and fabric types
- Order count tracking

### WorkDistribution
- Empty state placeholder for employee data
- Ready for future data integration

## Features

- Responsive design optimized for mobile
- Clean, modern UI with consistent styling
- Color-coded status indicators
- Touch-friendly interface elements
- Scrollable content with proper spacing

## Navigation

The dashboard is accessible via `/dashboard` route and integrates with the existing app navigation structure.