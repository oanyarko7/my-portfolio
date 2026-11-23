# Nyarko Osumanu Adamu — Portfolio

A high-performance, accessible developer portfolio showcasing startup engineering, client systems, embedded projects, and backend architectures.

**Live site:** [my-portfolio-gamma-nine-59.vercel.app](https://my-portfolio-gamma-nine-59.vercel.app)

---

## Highlights & Engineering Architecture

- **Next.js 16 (App Router) & React 19**: Clean server-first architecture with strict separation of client interactivity.
- **Hand-crafted 3D Canvas Matrix Engine**: A custom perspective 3D canvas pipeline ([`app/components/matrix3d.ts`](app/components/matrix3d.ts)) with adaptive frame budgeting, zero heavy 3D library dependencies (saving >600KB bundle overhead), and mobile frame throttling.
- **Hardened HTTP Security**: Configured with strict security headers including `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (HSTS), and `Permissions-Policy`.
- **WAI-ARIA & Accessibility Compliant**:
  - Full keyboard accessibility and focus trapping in the command palette.
  - Complete `@media (prefers-reduced-motion: reduce)` support halting animations and canvas loops into static composed frames.
  - WCAG AA+ color contrast ratios across all semantic tokens.
  - Skip to content link and deep-linkable project accordions.
- **Power User Command Palette (`⌘K` / `Ctrl+K`)**: Rapid navigation across work, experience, about, and actions.
- **Automated OpenGraph Generation**: Dynamic link preview cards generated via `@vercel/og` ([`app/opengraph-image.tsx`](app/opengraph-image.tsx)).

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Graphics:** Hand-written HTML5 Canvas 2D / 3D perspective engine
- **Typography:** Geist, Geist Mono, Instrument Serif (`next/font/google`)
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/oanyarko7/my-portfolio.git
cd my-portfolio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Checks & Build

```bash
npm run typecheck  # TypeScript check
npm run lint       # ESLint check
npm run build      # Production build
```

---

## License

© 2026 [Nyarko Osumanu Adamu](https://github.com/oanyarko7). All rights reserved.
