# Svelte 5 Migration: Scaffolding & Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the SvelteKit application and the Svelte-based UI package, aligning them with the existing monorepo structure and deployment patterns.

**Architecture:** Create `apps/svelte-web` (SvelteKit) and `packages/ui-svelte` (shadcn-svelte). Configure Tailwind CSS v4 and `adapter-node` for Standalone-like production output.

**Tech Stack:** Svelte 5, SvelteKit 2, Tailwind CSS v4, shadcn-svelte, Bits UI.

---

### Task 1: Initialize SvelteKit App

**Files:**
- Create: `apps/svelte-web/package.json`
- Create: `apps/svelte-web/svelte.config.js`
- Create: `apps/svelte-web/vite.config.ts`

- [ ] **Step 1: Create the apps/svelte-web directory**
Run: `mkdir -p apps/svelte-web`

- [ ] **Step 2: Initialize package.json**
```json
{
  "name": "@multica/svelte-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 3001",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"
  },
  "devDependencies": {
    "@sveltejs/adapter-node": "^5.2.9",
    "@sveltejs/kit": "^2.15.1",
    "@sveltejs/vite-plugin-svelte": "^5.0.3",
    "svelte": "^5.16.0",
    "svelte-check": "^4.1.1",
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  }
}
```

- [ ] **Step 3: Create svelte.config.js**
```javascript
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
    alias: {
      "@/*": "./src/*",
    }
	}
};

export default config;
```

- [ ] **Step 4: Create vite.config.ts**
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
  server: {
    port: 3001
  }
});
```

- [ ] **Step 5: Install dependencies**
Run: `pnpm install` (from root)

- [ ] **Step 6: Commit**
Run: `git add apps/svelte-web && git commit -m "feat: init svelte-web app scaffolding"`

---

### Task 2: Initialize UI Package (shadcn-svelte)

**Files:**
- Create: `packages/ui-svelte/package.json`
- Create: `packages/ui-svelte/components.json`

- [ ] **Step 1: Create the packages/ui-svelte directory**
Run: `mkdir -p packages/ui-svelte/src/lib/components/ui`

- [ ] **Step 2: Initialize package.json**
```json
{
  "name": "@multica/ui-svelte",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    "./components/*": "./src/lib/components/*.svelte",
    "./ui/*": "./src/lib/components/ui/*.svelte",
    "./utils": "./src/lib/utils.ts"
  },
  "dependencies": {
    "bits-ui": "^1.0.0-next.67",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "svelte": "^5.16.0",
    "typescript": "^5.7.2"
  }
}
```

- [ ] **Step 3: Run shadcn-svelte init**
Run: `cd apps/svelte-web && npx shadcn-svelte@latest init`
*Note: Select defaults, ensure it targets Svelte 5.*

- [ ] **Step 4: Commit**
Run: `git add packages/ui-svelte apps/svelte-web/components.json && git commit -m "feat: init ui-svelte package with shadcn"`

---

### Task 3: Configure Tailwind CSS v4

**Files:**
- Modify: `apps/svelte-web/src/app.css`
- Modify: `apps/svelte-web/vite.config.ts`

- [ ] **Step 1: Install Tailwind v4**
Run: `pnpm add -D tailwindcss @tailwindcss/vite` in `apps/svelte-web`

- [ ] **Step 2: Update vite.config.ts to include tailwind plugin**
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
});
```

- [ ] **Step 3: Create src/app.css with Tailwind directives**
```css
@import "tailwindcss";

@theme {
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* Add more mapping from existing globals.css */
}
```

- [ ] **Step 4: Run dev server to verify styles**
Run: `pnpm --filter @multica/svelte-web dev`
Expected: Server starts on 3001, basic tailwind classes work.

- [ ] **Step 5: Commit**
Run: `git add apps/svelte-web/src/app.css apps/svelte-web/vite.config.ts && git commit -m "chore: configure tailwind v4"`
