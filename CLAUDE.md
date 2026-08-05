# Project Coding Standards

## TypeScript

- Use double quotes (`"`).
- Always use semicolons.
- Prefer explicit TypeScript types.
- Avoid `any` unless absolutely necessary.
- Interface names should be prefixed with `I`.
- Type aliases should be prefixed with lowercase `t`.
- Enum names should be prefixed with lowercase `e`.
- Custom hook names should begin with `use`.
- Functions should be typed with explicit return types.
- Functions should be named in PascalCase for components and functions.

## Formatting

Opening braces should be on a new line (Allman style).

Preferred:

```ts
if (isLoading)
{
    return null;
}
```

Avoid:

```ts
if (isLoading) {
    return null;
}
```

This is true also for function declarations, type declarations, enum declarations, object literals, and other blocks of code. Keep function parameters on one line when they fit naturally; only wrap when needed for readability. Indent with 3 spaces, use double quotes, and end statements with semicolons. ESLint with `@stylistic/brace-style: ["error", "allman"]` and `@stylistic/function-paren-newline: ["error", "never"]` should enforce this on save.

Use UK spelling for identifiers, comments, and UI copy where possible (for example: `colour`, `organise`, `favourite`). Keep platform/API-required spellings unchanged (for example DOM/CSS property names like `backgroundColor` and `color`, and external API names).

## React

- Use functional components only.
- Use TypeScript for all files.
- Prefer named exports.
- Keep components focused and small.
- Extract reusable logic into custom hooks.

## Styling

- Use CSS Modules (one `.module.css` co-located per component) — the closest web equivalent to a scoped `StyleSheet.create` object: styles stay local to the component that owns them instead of colliding globally.
- Do not use Tailwind CSS.
- Do not use styled-components.
- Global tokens (colour palette, type scale, spacing) live in `src/index.css` as CSS custom properties; component modules consume them via `var(--token)`, never hardcoded values.

## Imports

Order imports as:

1. React
2. Third-party packages
3. Services
4. Hooks
5. Components
6. Types
7. Styles

Keep imports on one line unless they become genuinely long (many named imports), then wrap for readability.

## Project Context

This project is **vinty.dev** — a personal portfolio site.

Stack: ASP.NET Core Web API backend (`server/`, .NET 10, EF Core + PostgreSQL) and a React + TypeScript + Vite frontend (`client/`), served separately and talking over `/api/*`.

The site focuses on:

- Showcasing personal projects with their tech stacks
- A skills/capabilities overview
- A working contact form

These backend (`server/`) coding standards are not covered by this document — it applies to the `client/` React codebase only.
