# UI Context

---

## Theme

- **Dark theme only** — no light mode, no theme toggle
- Background: `#050505` (near-black)
- Surface colors: `zinc-900` (`#18181B`) for cards, `zinc-800` (`#27272A`) for elevated surfaces
- Text: `zinc-50` (`#FAFAFA`) primary, `zinc-400` (`#A1A1AA`) secondary, `zinc-500` muted
- Accent: `#F59E0B` (amber-500) primary, `amber-400` (`#FBBF24`) hover
- Selection: `amber-500/30`
- Borders: `white/5` default, `white/10` on hover
- Danger: `red-500` for destructive actions, `red-400/10` background on error boundary

---

## Typography

• Font pairing principles
• Hierarchy and contrast
• Letter spacing nuances

• Color psychology
• Contrast ratios
• Accessibility standards

### Font Stack

- **Sans-serif**: Geist (via `next/font/google`) — primary UI font
- **Mono**: Geist Mono (via `next/font/google`) — code blocks, prompts, technical output
- Fallback: `sans-serif` / `monospace` system fonts

### Type Scale

- Hero headline: `text-6xl` → `text-8xl` (`lg`) → `text-[112px]` (`lg` on landing page)
- Section headings: `text-2xl` → `text-3xl`
- Card titles: `text-lg` → `text-xl`
- Body: `text-sm` → `text-base`
- Caption/label: `text-xs` → `text-sm`
- Monospace output: `text-sm` with `font-mono`

### Font Weights

- Headings: `font-semibold` (`600`) or `font-bold` (`700`)
- Body: `font-normal` (`400`)
- Labels/badges: `font-medium` (`500`)

---

## Spacing & Layout

- **Page max-width**: none (full-width dark background)
- **Content container**: `max-w-7xl` with `px-4` to `px-8` responsive padding
- **Section spacing**: `py-16` to `py-24`, `gap-8` to `gap-12` between sections
- **Card padding**: `p-6` standard, `p-4` for compact cards
- **Grid columns**: 3-column layouts at `lg`, 2 at `md`, 1 at `sm`
- **Border radius**: `rounded-xl` (`12px`) standard for inputs, cards, modals; `rounded-2xl` for section panels; `rounded-3xl` for large cards; `rounded-md` for badges
- **Gap**: `gap-4` between form elements, `gap-3` between buttons in groups

---

## Component Conventions

### Modal Pattern

All 5 modals use the `useModal` hook (`hooks/use-modal.ts`), which provides:

- **Escape key** closes the modal
- **Backdrop click** closes the modal (via `handleBackdropClick` which checks `e.target === e.currentTarget`)
- **Focus restoration** — on mount saves `document.activeElement`, on unmount restores it
- **ARIA attributes** — `role="dialog"`, `aria-modal="true"`, `aria-label` on the overlay
- Overlay: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl`
- Centered `motion.div` with `initial={{ opacity: 0, scale: 0.95, y: 20 }}` entrance
- Same `animate`/`exit` with spring transition
- Close button (X icon) in top-right corner with `aria-label="Close {name}"`
- Wrapped in `<AnimatePresence>` for exit animations

### Button Pattern

- **Primary**: `bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl` with forge glow shadow
- **CTA** (landing): same gradient with `shadow-[0_0_24px_-6px_rgba(245,158,11,0.15)]` and `hover:shadow-[0_0_32px_-4px_rgba(245,158,11,0.35)]`
- **Secondary**: `bg-white text-black rounded-xl font-semibold`
- **Ghost**: `hover:bg-white/5 text-zinc-500 hover:text-white rounded-xl`
- **Icon**: same as ghost with `p-2` (square)
- **Danger**: `text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl`
- All buttons have `transition-all` and `active:scale-95` on click
- Disabled: `disabled:opacity-50` with custom disabled styles for gradient buttons (`disabled:bg-zinc-800 disabled:from-zinc-800 disabled:to-zinc-800 disabled:shadow-none`)
- Generate button has `title` tooltip when disabled due to missing API key

### Card Pattern

- `bg-zinc-900/50` surface (semi-transparent)
- `border border-white/5` default, `hover:border-white/10`
- `rounded-2xl` or `rounded-3xl` with `p-6` padding
- Title in `font-semibold text-white`, description in `text-sm text-zinc-400 font-light`
- Optional badge in top-right: `text-xs px-2 py-1 rounded-md bg-white/5 text-zinc-500`

### Input & Textarea Pattern

- `w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700`
- Focus: `focus:outline-none focus:border-amber-500/50`
- Password inputs: same styling with `pr-12` for the show/hide toggle button (with `aria-label`)
- Textarea: `rounded-xl` (standardized), `resize-none` in most cases

### Select/Dropdown Pattern

- Matches input styling: `bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-400 appearance-none`
- Chevron icon positioned absolute right
- Inline selects (compact): match input styling

### Badge Pattern

- **Category**: `text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-white/5 text-zinc-500 rounded-md`
- **Model**: same size/spacing, `bg-amber-500/10 text-amber-400 rounded-md`
- **Custom**: `bg-amber-500/10 text-amber-400 rounded-md`

### Toast Pattern

- Fixed `bottom-6 right-6` positioning
- `bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl shadow-black/50`
- `role="status"` and `aria-live="polite"` for screen readers
- Entrance/exit: AnimatePresence with fade + slide
- Type indicator: green check for success, amber sparkles for info
- Dismiss button: small ghost icon button
- Auto-dismiss handled by parent via `setTimeout(3000)`

### Loading States

- **Spinner**: three pulsing bordered circles with CSS `ring-pulse` animation (staggered 0.3s delays)
- **Text**: `"Forging..."` uppercase with tracking
- **Button loading**: icon-only loader (`Loader2` with `animate-spin`) replacing the button label
- **Skeleton**: `OutputPanelSkeleton` + `EvaluationSkeleton` components with shimmer animation (`@keyframes shimmer` in globals.css)

### Hover-Reveal Pattern (deprecated)

- Previously used `opacity-40 hover:opacity-100` on action buttons in vault/versions
- **Replaced** with always-visible muted actions (`opacity-40` without hover dependency) in Phase 5 UI iteration

---

## Animation Conventions

Do:
• Use subtle, purposeful animations
• Keep durations under 0.5s for UI feedback
• Provide animation controls for accessibility
• Test performance on slower devices
Avoid:
• Excessive or distracting animations
• Auto-playing content without controls
• Animations that interfere with usability
• Heavy effects that slow page load

### Entrance Animations (motion library)

| Use Case | Pattern |

|----------|---------|
| Page sections (hero, features) | `initial={{ opacity: 0, y: 20 }}` / `animate={{ opacity: 1, y: 0 }}`, `transition={{ delay: i * 0.1 }}` for staggered |
| Generator panels | `initial={{ opacity: 0, x: -20 }}` / `whileInView={{ opacity: 1, x: 0 }}` (left col), `x: 20` (right col) |
| Modals | `initial={{ opacity: 0, scale: 0.95, y: 20 }}` / `animate={{ opacity: 1, scale: 1, y: 0 }}` with spring |
| Landing headline | `initial={{ opacity: 0, y: 40 }}` for more dramatic entrance |
| Content swap | `<AnimatePresence mode="wait">` with fade in/out |
| Toast | `initial={{ opacity: 0, y: 50, scale: 0.9 }}` / `animate={{ opacity: 1, y: 0, scale: 1 }}` |
| Category buttons | `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}` |
| Evaluation score | `initial={{ scale: 0.5, opacity: 0 }}` → spring `{ type: "spring", stiffness: 200, damping: 12 }` |

### Custom Easing

Primary cubic bezier for page animations: `[0.16, 1, 0.3, 1]` — smooth ease-out with slight overshoot.

### Viewport Activation

Sections use `whileInView` with `viewport={{ once: true }}` — animations fire once on scroll into view, no repeat.

### CSS Animations (globals.css)

- `@keyframes blink`: opacity 0/1 toggle for typing cursor
- `@keyframes ring-pulse`: scale + opacity for loading spinner rings
- `@keyframes shimmer`: gradient sweep for skeleton loaders (1.5s, downscaled from 2s)
- `@keyframes ember`: floating particle animation for "ember" decorative elements
- Custom classes: `.bg-dot-grid` (radial dot pattern), `.line-numbers` (horizontal rule lines), `.cursor-blink` (typing cursor pseudo-element), `.refine-bar` (left border accent), `.forge-ember` (particle container)

---

## Responsive Design

**Mobile Considerations**
• Touch targets should be at least 44px
• Use larger text sizes for readability
• Simplify navigation and reduce clutter
• Consider thumb-friendly placement
• Optimize for single-column layouts

**Desktop Enhancements**
• Add detailed hover states and animations
• Utilize multi-column layouts effectively
• Include keyboard navigation support
• Provide contextual tooltips and help
• Optimize for mouse and trackpad interactions

- **Mobile** (< 768px): single column layout, stacked panels, hamburger menu in navbar
- **Tablet** (768px-1024px): 2-column grids where possible
- **Desktop** (> 1024px): full 3-column / side-by-side layouts
- The forge app layout uses `flex-col lg:flex-row` for the generator section
- Mobile hamburger menu implemented in `forge-navbar.tsx` with `aria-label="Toggle menu"`

### Breakpoint Strategy

**Mobile** (0-640px): Single column, large touch targets, simplified navigation
**Tablet** (641-1024px): Two-column layouts, medium touch targets, adaptive navigation
**Desktop** (1025px+): Multi-column layouts, hover states, detailed interactions

---

## Accessibility Checklist

**Color & Contrast**
• Maintain 4.5:1 contrast ratio for normal text
• Maintain 3:1 contrast ratio for large text
• Don't rely solely on color to convey information
• Test with color blindness simulators
• All icon-only buttons have `aria-label`
• Toast uses `role="status"` + `aria-live="polite"`
• Error boundary uses `role="alert"`
• Output panel has `aria-describedby`
• Star ratings have descriptive `aria-label`
**Interactive Elements**
• Provide clear focus indicators
• Ensure touch targets are at least 44px
• Use semantic HTML elements
• Provide alternative text for images
• All modals have `role="dialog"` + `aria-modal="true"`

Do's
• Maintain consistency across all components and pages
• Consider accessibility and color contrast in all design decisions
• Test your designs in both light and dark themes
• Use shadows purposefully to create clear visual hierarchy
• Choose colors that align with your brand identity and target audience
• Implement responsive design principles from the start
• Use semantic color meanings (red for errors, green for success)
• Create a design system with reusable components
• Test with real users and gather feedback
• Consider cultural color associations for global audiences

Don'ts
• Don't use too many different colors in one design (stick to 3-5 main colors)
• Avoid low contrast combinations that hurt readability
• Don't overuse shadows or visual effects
• Avoid mixing incompatible style types within the same interface
• Don't ignore mobile and responsive considerations
• Don't use color as the only way to convey information
• Don't follow trends blindly without considering your users
• Don't neglect performance implications of complex styling
• Don't make assumptions about user preferences

Pro Tips
• Use the 60-30-10 rule for color distribution in your designs
• Create hover and focus states that are 10-20% darker/lighter than base colors
• Implement a consistent border radius system (e.g., 4px, 8px, 16px)
• Use CSS custom properties for easy theme switching
• Consider using a color palette generator for harmonious combinations
• Test your designs with color blindness simulators
• Use relative units (rem, em) for better scalability
• Implement a consistent spacing scale (e.g., 4px, 8px, 16px, 32px)
• Consider the emotional impact of your color choices
• Document your design decisions for team consistency

---

## Icons

- Library: `lucide-react` 0.577.0
- Common icons by component:
  - Generation: `Wand2`, `Sparkles`, `Terminal`, `Copy`, `Check`, `Download`
  - Navigation: `History`, `Search`, `MessageSquare`, `Library`
  - Evaluation: `BarChart`, `CheckCircle2`, `AlertTriangle`, `Lightbulb`, `Zap`
  - Settings: `Key`, `Eye`, `EyeOff`, `Globe`, `Cpu`, `Trash2`
  - Modals: `X`, `GitCommit`, `ArrowRight`
  - Loading: `Loader2` (with `animate-spin`)
  - Misc: `ChevronDown`, `Bot`, `MessageSquarePlus`, `Star`
  ---
