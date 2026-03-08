---
globs: src/frontend/**
---
# Frontend Rules

## Component conventions

- Use functional components with hooks.
- Keep components under 200 lines. Extract sub-components when they grow.
- Co-locate styles, tests, and types with their component.

## State management

- Prefer local state. Lift state only when shared across siblings.
- Document any global state decisions in LEARNINGS.md.

## Performance

- Lazy-load routes and heavy components.
- Avoid unnecessary re-renders — memoize expensive computations.

## Design system

- Use **shadcn/ui** components and patterns as the primary design system.
- Use **Base UI** (`@base-ui/react`) for unstyled primitives.
- **Never use Radix UI** directly — Base UI is the preferred primitive library.
- Follow the project's design tokens for colors, spacing, radii, and shadows.
- Prefer CSS variables / Tailwind tokens over hardcoded values.

## Accessibility (WCAG AA mandatory)

- All interactive elements must be keyboard-navigable.
- Use semantic HTML elements (`nav`, `main`, `section`, `article`, `button`).
- Include aria-labels on icon-only buttons.
- Color contrast: 4.5:1 for body text, 3:1 for large text.
- Never use color alone to convey meaning — pair with icons or text.
- Form inputs must have associated labels.
- Focus indicators must be visible on all interactive elements.

## Responsive design

- Design mobile-first, then scale up.
- Breakpoints: mobile (<768px), tablet (768-1279px), desktop (>=1280px).
- Touch targets at least 44x44px on mobile.
- No horizontal scrolling on any viewport.
