# Svelte 5 Migration: Auth & Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Login page, global layout, and sidebar navigation using Svelte 5 and SvelteKit, integrating with the Core Runes API layer.

**Architecture:** Use SvelteKit `hooks.server.ts` for auth checking, `+layout.svelte` for global state initialization via `setCoreContext`, and `shadcn-svelte` for the UI.

**Tech Stack:** Svelte 5, SvelteKit, shadcn-svelte, Core Runes (Context-based).

---

### Task 1: Implement Server Hooks & Auth Checking

**Files:**
- Create: `apps/svelte-web/src/hooks.server.ts`

- [ ] **Step 1: Implement the handle hook for auth and proxying**
```typescript
// apps/svelte-web/src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('multica_token');
  
  // If no token and not on login page, redirect (simple version)
  if (!token && !event.url.pathname.startsWith('/login')) {
    return new Response(null, { status: 302, headers: { Location: '/login' } });
  }

  // Pass token to locals for use in load functions
  event.locals.token = token || null;

  return await resolve(event);
};
```

- [ ] **Step 2: Commit**
Run: `git add apps/svelte-web/src/hooks.server.ts && git commit -m "feat(web): add server hooks for auth"`

---

### Task 2: Implement Global Layout & Core Context

**Files:**
- Create: `apps/svelte-web/src/routes/+layout.svelte`
- Create: `apps/svelte-web/src/routes/+layout.ts`

- [ ] **Step 1: Implement the root layout data loader**
```typescript
// apps/svelte-web/src/routes/+layout.ts
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  return {
    token: data?.token
  };
};
```

- [ ] **Step 2: Implement the root layout with Context**
```svelte
<!-- apps/svelte-web/src/routes/+layout.svelte -->
<script lang="ts">
  import "../app.css";
  import { setCoreContext } from "@multica/core/svelte";
  import { onMount } from "svelte";

  let { data, children } = $props();
  
  // Initialize Core Context (per-session)
  const { api, workspaceStore } = setCoreContext("/api");

  $effect(() => {
    if (data.token) {
      api.setToken(data.token);
    }
  });

  onMount(async () => {
    if (data.token) {
      await workspaceStore.fetchWorkspaces();
    }
  });
</script>

{@render children()}
```

- [ ] **Step 3: Commit**
Run: `git add apps/svelte-web/src/routes && git commit -m "feat(web): add root layout with core context"`

---

### Task 3: Implement Login Page

**Files:**
- Create: `apps/svelte-web/src/routes/login/+page.svelte`
- Create: `apps/svelte-web/src/routes/login/+page.server.ts`

- [ ] **Step 1: Implement the Login Server Action**
```typescript
// apps/svelte-web/src/routes/login/+page.server.ts
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    // Here we would call the actual API, but for now we simulate
    // In a real app, call: const res = await api.login(email, password);
    const mockToken = "mock-token-" + Date.now();
    cookies.set('multica_token', mockToken, { path: '/' });

    throw redirect(303, '/issues');
  }
};
```

- [ ] **Step 2: Implement the Login Page UI**
```svelte
<!-- apps/svelte-web/src/routes/login/+page.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
</script>

<div class="flex h-screen items-center justify-center bg-background">
  <div class="w-full max-w-sm space-y-4 p-8 border rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold">Multica Login</h1>
    <form method="POST" class="space-y-4">
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />
      <Button type="submit" class="w-full">Sign in</Button>
    </form>
  </div>
</div>
```

- [ ] **Step 3: Commit**
Run: `git add apps/svelte-web/src/routes/login && git commit -m "feat(web): add login page with server actions"`

---

### Task 4: Implement Sidebar Navigation

**Files:**
- Create: `apps/svelte-web/src/lib/components/navigation/Sidebar.svelte`

- [ ] **Step 1: Implement the Sidebar UI with shadcn**
```svelte
<!-- apps/svelte-web/src/lib/components/navigation/Sidebar.svelte -->
<script lang="ts">
  import { useWorkspaceStore } from "@multica/core/svelte";
  import { Button } from "$lib/components/ui/button";

  const workspaceStore = useWorkspaceStore();
</script>

<aside class="w-64 border-r h-full flex flex-col bg-sidebar">
  <div class="p-4 font-bold border-b">Multica Svelte</div>
  <nav class="flex-1 p-2 space-y-1">
    {#each workspaceStore.workspaces as ws}
      <Button variant="ghost" class="w-full justify-start" onclick={() => workspaceStore.setActiveWorkspace(ws.id)}>
        {ws.name}
      </Button>
    {/each}
  </nav>
</aside>
```

- [ ] **Step 2: Commit**
Run: `git add apps/svelte-web/src/lib/components/navigation && git commit -m "feat(web): add sidebar navigation"`
