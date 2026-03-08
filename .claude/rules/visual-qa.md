---
globs: src/**/*.{tsx,jsx,vue,svelte,html,css,scss}
---
# Visual QA & Design System Rules

## Design system

- Use **shadcn/ui** components and patterns as the primary design system.
- Use **Base UI** (`@base-ui/react`) for unstyled primitives when building custom components.
- **Never use Radix UI** directly. Base UI is the preferred primitive library.
- Follow the project's design tokens for colors, spacing, radii, and shadows.

## Responsive design

- Design mobile-first, then scale up to tablet and desktop.
- Breakpoints: mobile (<768px), tablet (768-1279px), desktop (>=1280px).
- Touch targets must be at least 44x44px on mobile viewports.
- No horizontal scrolling on any viewport.

## Accessibility (WCAG AA mandatory)

- All interactive elements must be keyboard-navigable.
- Color contrast: 4.5:1 for body text, 3:1 for large text and UI components.
- Never use color alone to convey meaning — pair with icons or text.
- All images need alt text. Decorative images use `alt=""`.
- Form inputs must have associated labels (visible or aria-label).
- Focus indicators must be visible on all interactive elements.

## Component patterns

- Keep components under 200 lines. Extract sub-components when they grow.
- Co-locate styles, tests, and types with their component.
- Use semantic HTML elements (`nav`, `main`, `section`, `article`, `button`).
- Prefer CSS variables / Tailwind tokens over hardcoded values.
- Loading states: use skeleton loaders consistent with shadcn/ui patterns.
- Error states: inline validation with icon + color + text.
- Empty states: helpful guidance, not blank screens.
