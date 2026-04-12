# Spec: Next.js to Svelte 5 Migration (Big Bang Approach)

- **Date:** 2026-04-12
- **Topic:** Full rewrite of the frontend from Next.js 16 to Svelte 5 (Runes) + SvelteKit.
- **Goal:** Replace the current `apps/web` with a more performant and maintainable Svelte 5 implementation while maintaining 100% functionality parity.

## 1. Context & Objectives

The current Multica frontend is built with Next.js 16, relying heavily on the React ecosystem (React Query, Zustand, Radix UI). To leverage the performance benefits and developer experience of Svelte 5 (specifically Runes), we are performing a complete rewrite of the frontend layer.

### Core Constraints
- **Backend Parity:** The Golang backend remains untouched. All API and WebSocket protocols must be preserved.
- **Zero Regressions:** Functionality must be validated against existing Playwright E2E tests.
- **Parallel Development:** The new Svelte application will be developed in a new directory (`apps/svelte-web`) to avoid disrupting the current workflow.

## 2. Technical Strategy

### 2.1 Framework & Core Stack
- **Framework:** SvelteKit 2.x with Svelte 5 (Runes).
- **Rendering Mode:** Server-Side Rendering (SSR) via `adapter-node` to match current deployment patterns.
- **Styling:** Tailwind CSS (v3 or v4 as per `shadcn-svelte` requirements).
- **UI Components:** `shadcn-svelte` (v1.0+, built on Bits UI).

### 2.2 State & Data Management
We are moving away from TanStack Query and Zustand to a pure Svelte 5 Runes architecture.

- **Data Fetching:** Standard `fetch` in SvelteKit `load` functions and components.
- **Reactivity:** Use `$state`, `$derived`, and `$effect` for all state management.
- **Domain Objects:** Implement business logic as Svelte 5 Classes (e.g., `IssueStore.svelte.ts`) to manage caching and optimistic updates.
- **Global State:** Shared state instances exported from `.svelte.ts` files.

### 2.3 Feature-Specific Solutions
- **Real-time (WebSockets):** Re-implement the `realtime` client using Svelte 5 Runes to drive UI updates directly from incoming messages.
- **Rich Text Editor:** Implement a Svelte 5 wrapper for Tiptap.
- **Drag & Drop:** Use `svelte-dnd-action` for Board and List reordering.

## 3. Architecture & Project Structure

### 3.1 New Monorepo Layout
- `apps/svelte-web/`: Main SvelteKit application.
- `packages/ui-svelte/`: Component library built with `shadcn-svelte`.
- `packages/core/src/svelte/`: Svelte-specific domain logic and state management.

### 3.2 Key Mappings
| Feature | Next.js Implementation | Svelte 5 Implementation |
| :--- | :--- | :--- |
| Auth | NextAuth or custom hooks | SvelteKit hooks + Server Actions |
| Issues | Board/List views in React | Svelte 5 Board/List with `svelte-dnd-action` |
| Navigation | Next.js Link / Router | SvelteKit standard routing |

## 4. Verification Plan

### 4.1 Automated Testing
- **E2E Tests:** Run existing Playwright tests (`e2e/*.spec.ts`) against the Svelte development server.
- **Success Criteria:** 100% pass rate on all existing functional tests.
- **Unit Tests:** New Vitest suites for Svelte 5 Classes in `packages/core`.

### 4.2 Manual Verification
- Verify WebSocket sync between multiple browser tabs.
- Performance profiling (Lighthouse/Web Vitals) comparison between Next.js and Svelte versions.

## 5. Phased Implementation

1. **Scaffolding:** Initialize `apps/svelte-web` and `packages/ui-svelte`.
2. **Infrastructure:** Auth, Layout, and Core API client (Runes version).
3. **Core Modules:** Issues (Board/List), Workspace management.
4. **Advanced Modules:** Chat, Inbox, Settings, Agent Transcripts.
5. **Final Parity:** Polish UI, fix E2E failures, and perform final cutover.

## 6. Cleanup & Cutover
Once the Svelte version passes all tests:
1. Rename `apps/web` to `apps/web-legacy`.
2. Rename `apps/svelte-web` to `apps/web`.
3. Update build scripts and CI/CD pipelines.

---
© 2026 Multica Migration Team
