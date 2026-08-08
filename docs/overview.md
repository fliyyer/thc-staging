# True High Collabs Documentation

True High Collabs is a Next.js App Router project built with TypeScript, Tailwind CSS, and shadcn/ui conventions.

## Stack

- Next.js App Router
- React with TypeScript and TSX components
- Tailwind CSS
- shadcn/ui component structure
- Lucide React icons

## Project Structure

```txt
app/
  layout.tsx       Root layout and metadata
  page.tsx         Home screen
  globals.css      Tailwind and design tokens
components/
  ui/button.tsx    shadcn-style Button component
lib/
  utils.ts         Shared className helper
docs/
  overview.md      Project documentation
  git-release.md   Git commit and release version rules
```

## Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## shadcn/ui

The project includes `components.json`, `lib/utils.ts`, Tailwind CSS variables, and an initial `Button` component. New components can be added with:

```bash
npx shadcn@latest add <component-name>
```

Example:

```bash
npx shadcn@latest add card dialog input
```

## Project Rules

- See [Git Commit and Release Version Rules](git-release.md) for commit format, branch naming, versioning, tags, and release checklist.
