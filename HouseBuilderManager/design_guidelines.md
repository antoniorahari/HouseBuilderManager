# Design Guidelines - Construction Management App

## Design Approach

**System Selected**: Material Design  
**Rationale**: Data-heavy productivity application requiring clear information hierarchy, robust form patterns, and mobile-first responsive design for on-site use. Material Design provides excellent patterns for tables, cards, and financial data visualization.

## Typography System

**Font Family**: Inter (Google Fonts)
- Primary: Inter for all UI elements
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

**Type Scale**:
- Page Titles: text-3xl font-bold (Dashboard, Matériaux, Maçons)
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Labels/Meta: text-sm font-medium
- Financial Figures: text-2xl font-bold (dashboard totals), text-lg font-semibold (subtotals)

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12
- Component padding: p-6 (cards, forms)
- Section spacing: space-y-6, gap-6
- Page margins: px-4 md:px-8
- Element gaps: gap-3 (buttons), gap-4 (form fields)

**Container Strategy**:
- Max-width: max-w-7xl mx-auto
- Mobile: Full-width with px-4
- Desktop: Constrained with generous margins

**Grid System**:
- Dashboard: 2-column on desktop (lg:grid-cols-2), single on mobile
- Material/Purchase lists: Single column cards with internal grid
- Mason cards: Grid of 2-3 columns (md:grid-cols-2 lg:grid-cols-3)

## Component Library

### Navigation
- Top app bar with title and navigation links
- Mobile: Hamburger menu with slide-out drawer
- Fixed position on scroll for quick access
- Height: h-16

### Dashboard Cards
- Elevated cards (shadow-md) with p-6 padding
- Financial metric cards: Icon + Label + Large number display
- Layout: Vertical stack with icon at top, centered text
- Minimum height: min-h-32

### Data Tables
- Striped rows for better readability
- Sticky header on scroll
- Actions column (right-aligned): Edit/Delete icons
- Mobile: Transform to stacked cards
- Row padding: py-4

### Forms
- Floating labels pattern (Material Design)
- Input fields: Full-width with border, rounded-lg, p-3
- Spacing between fields: space-y-4
- Submit buttons: Full-width on mobile, auto on desktop
- Form sections: Separated by mb-8

### Action Buttons
- Primary: Rounded-lg, px-6, py-3, font-medium
- Floating Action Button (FAB): Fixed bottom-right for "+ Ajouter"
- Icon buttons: p-2, rounded-full for table actions
- Button groups: gap-3

### Cards (Material/Mason Cards)
- Border with rounded-xl
- Padding: p-6
- Header with title + quick stats
- Body with key information in grid
- Footer with action buttons (right-aligned)

### Mason Detail View
- Tabbed interface: "Journées" | "Avances" | "Repas"
- Summary card at top: Name, Salaire, Solde (prominent)
- Timeline/list view for transactions
- Each entry: Date | Description | Amount (grid layout)

### Reports/Totals Display
- Large number displays with labels
- Use dividers (border-t) to separate sections
- Highlight totals: Slightly larger text, bolder weight
- Progress bars for budget tracking (if applicable)

## Page-Specific Layouts

### Dashboard
- Hero summary: 4 key metrics in grid (2x2 on mobile, 4 columns on desktop)
- Recent activity cards below
- Quick actions prominently placed

### Materials Page
- List view with search/filter at top
- Each material: Name + Total spent + View details button
- Add material: FAB or top-right button

### Purchase History
- Table with columns: Date | Matériau | Quantité | Prix
- Filter by date range and material type
- Summary card at top showing totals

### Mason Detail
- Profile header: Name, Photo placeholder, Key stats
- Three-panel layout: Work log | Advances | Meals
- Running total displayed prominently
- Add entry forms accessible via tabs

## Responsive Behavior

**Breakpoints**:
- Mobile: Base styles
- Tablet: md: (768px) - 2 columns, larger touch targets
- Desktop: lg: (1024px) - Full multi-column layouts

**Mobile Optimizations**:
- Stack all multi-column layouts
- Bottom sheet modals instead of centered
- Larger touch targets (min h-12)
- Fixed bottom navigation for key actions
- Swipeable tabs

## Form Patterns

**Add Material/Mason**:
- Modal overlay (desktop) or full-screen (mobile)
- Fields: Name (required), additional info
- Footer: Cancel | Save buttons

**Add Purchase/Work Entry**:
- Inline expandable form in list view
- Date picker (calendar icon)
- Number inputs with increment/decrement
- Auto-calculate totals on input

**Search & Filters**:
- Sticky search bar below header
- Collapsible advanced filters
- Clear filters button when active

## Accessibility
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Proper heading hierarchy (h1 → h6)
- Form validation with clear error messages
- Sufficient touch target sizes (min 44x44px)

## Images
No hero images required - this is a data-focused utility application. Use icons throughout:
- Material Design Icons via CDN
- Dashboard: Financial icons (wallet, receipt, users, materials)
- Empty states: Illustrations for "No data yet" states