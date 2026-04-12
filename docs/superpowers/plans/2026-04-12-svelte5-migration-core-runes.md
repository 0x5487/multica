# Svelte 5 Migration: Core Runes & API Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-implement the API client and business logic using Svelte 5 Runes ($state, $derived, $effect), replacing TanStack React Query and Zustand.

**Architecture:** Create `packages/core/src/svelte/` with domain-specific classes (Stores) that manage state and non-synchronous data fetching.

**Tech Stack:** Svelte 5 Runes, TypeScript, Native Fetch.

---

### Task 1: Initialize Svelte-Specific Core Structure

**Files:**
- Create: `packages/core/src/svelte/index.ts`
- Create: `packages/core/src/svelte/api-client.svelte.ts`

- [ ] **Step 1: Create the packages/core/src/svelte directory**
Run: `mkdir -p packages/core/src/svelte`

- [ ] **Step 2: Implement the Base API Client with Runes**
```typescript
// packages/core/src/svelte/api-client.svelte.ts
export class ApiClient {
  baseUrl: string;
  token = $state<string | null>(null);

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const api = new ApiClient('/api');
```

- [ ] **Step 3: Create index.ts export**
```typescript
// packages/core/src/svelte/index.ts
export * from './api-client.svelte';
```

- [ ] **Step 4: Commit**
Run: `git add packages/core/src/svelte && git commit -m "feat(core): init svelte runes api client"`

---

### Task 2: Implement Workspace Store (Runes)

**Files:**
- Create: `packages/core/src/svelte/workspace-store.svelte.ts`

- [ ] **Step 1: Implement the WorkspaceStore Class**
```typescript
// packages/core/src/svelte/workspace-store.svelte.ts
import { api } from './api-client.svelte';

export class WorkspaceStore {
  workspaces = $state<any[]>([]);
  activeWorkspaceId = $state<string | null>(null);
  loading = $state(false);

  async fetchWorkspaces() {
    this.loading = true;
    try {
      const data = await api.request<any[]>('/workspaces');
      this.workspaces = data;
    } finally {
      this.loading = false;
    }
  }

  setActiveWorkspace(id: string) {
    this.activeWorkspaceId = id;
  }
}

export const workspaceStore = new WorkspaceStore();
```

- [ ] **Step 2: Export from index.ts**
Modify `packages/core/src/svelte/index.ts`:
```typescript
export * from './api-client.svelte';
export * from './workspace-store.svelte';
```

- [ ] **Step 3: Commit**
Run: `git add packages/core/src/svelte && git commit -m "feat(core): add workspace store with runes"`

---

### Task 3: Implement Issue Store (Runes)

**Files:**
- Create: `packages/core/src/svelte/issue-store.svelte.ts`

- [ ] **Step 1: Implement the IssueStore Class with Cache**
```typescript
// packages/core/src/svelte/issue-store.svelte.ts
import { api } from './api-client.svelte';

export class IssueStore {
  issuesByWorkspace = $state<Record<string, any[]>>({});
  loading = $state(false);

  async fetchIssues(workspaceId: string) {
    if (this.issuesByWorkspace[workspaceId]) return; // Simple cache

    this.loading = true;
    try {
      const data = await api.request<any[]>(`/workspaces/${workspaceId}/issues`);
      this.issuesByWorkspace[workspaceId] = data;
    } finally {
      this.loading = false;
    }
  }

  getIssues(workspaceId: string) {
    return this.issuesByWorkspace[workspaceId] || [];
  }
}

export const issueStore = new IssueStore();
```

- [ ] **Step 2: Export from index.ts**
Modify `packages/core/src/svelte/index.ts`:
```typescript
export * from './api-client.svelte';
export * from './workspace-store.svelte';
export * from './issue-store.svelte';
```

- [ ] **Step 3: Commit**
Run: `git add packages/core/src/svelte && git commit -m "feat(core): add issue store with runes"`
