# Svelte 5 Migration: Issues Board & List Views Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the main Issues page with both Board (DND) and List views, synchronized with the Svelte 5 IssueStore.

**Architecture:** Use SvelteKit `+page.ts` for data pre-fetching, `svelte-dnd-action` for the Board view, and `shadcn-svelte` for cards and tables.

**Tech Stack:** Svelte 5, SvelteKit, shadcn-svelte, svelte-dnd-action, IssueStore (Runes).

---

### Task 1: Implement Issues Route & Data Loader

**Files:**
- Create: `apps/svelte-web/src/routes/issues/+page.svelte`
- Create: `apps/svelte-web/src/routes/issues/+page.ts`

- [ ] **Step 1: Implement the issues page data loader**
```typescript
// apps/svelte-web/src/routes/issues/+page.ts
import type { PageLoad } from './$types';
import { useWorkspaceStore, useIssueStore } from "@multica/core/svelte";

export const load: PageLoad = async ({ parent }) => {
  // Wait for layout data (token)
  await parent();
  
  return {};
};
```

- [ ] **Step 2: Implement the basic Issues page container**
```svelte
<!-- apps/svelte-web/src/routes/issues/+page.svelte -->
<script lang="ts">
  import { useWorkspaceStore, useIssueStore } from "@multica/core/svelte";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";

  const workspaceStore = useWorkspaceStore();
  const issueStore = useIssueStore();

  $effect(() => {
    if (workspaceStore.activeWorkspaceId) {
      issueStore.fetchIssues(workspaceStore.activeWorkspaceId);
    }
  });

  let view = $state<"board" | "list">("board");
</script>

<div class="p-6 space-y-4">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold">Issues</h1>
    <div class="flex space-x-2">
      <Button variant={view === "board" ? "default" : "outline"} onclick={() => view = "board"}>Board</Button>
      <Button variant={view === "list" ? "default" : "outline"} onclick={() => view = "list"}>List</Button>
    </div>
  </div>

  {#if view === "board"}
    <!-- Board view will go here -->
    <div class="text-muted-foreground">Board view coming soon...</div>
  {:else}
    <!-- List view will go here -->
    <div class="text-muted-foreground">List view coming soon...</div>
  {/if}
</div>
```

- [ ] **Step 3: Commit**
Run: `git add apps/svelte-web/src/routes/issues && git commit -m "feat(web): add issues page container with view switching"`

---

### Task 2: Implement Issue List View

**Files:**
- Create: `apps/svelte-web/src/lib/components/issues/IssueList.svelte`

- [ ] **Step 1: Implement the List view using shadcn-svelte Table**
```svelte
<!-- apps/svelte-web/src/lib/components/issues/IssueList.svelte -->
<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { Badge } from "$lib/components/ui/badge";

  let { issues = [] } = $props();
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Title</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Priority</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each issues as issue (issue.id)}
      <Table.Row>
        <Table.Cell class="font-medium">{issue.title}</Table.Cell>
        <Table.Cell><Badge variant="outline">{issue.status}</Badge></Table.Cell>
        <Table.Cell>{issue.priority}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
```

- [ ] **Step 2: Install Table and Badge components**
Run: `pnpm dlx shadcn-svelte@latest add table badge`

- [ ] **Step 3: Commit**
Run: `git add apps/svelte-web/src/lib/components/issues/IssueList.svelte && git commit -m "feat(web): add issue list view component"`

---

### Task 3: Implement Issue Board View (DND)

**Files:**
- Create: `apps/svelte-web/src/lib/components/issues/IssueBoard.svelte`

- [ ] **Step 1: Install svelte-dnd-action**
Run: `pnpm add svelte-dnd-action` in `apps/svelte-web`

- [ ] **Step 2: Implement the Board view with columns and drag-and-drop**
```svelte
<!-- apps/svelte-web/src/lib/components/issues/IssueBoard.svelte -->
<script lang="ts">
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import * as Card from "$lib/components/ui/card";

  let { issues = [] } = $props();

  const statuses = ["backlog", "todo", "in-progress", "done"];
  
  let columns = $derived(statuses.map(status => ({
    id: status,
    title: status.toUpperCase(),
    items: issues.filter(i => i.status === status)
  })));

  function handleDndConsider(columnId: string, e: CustomEvent) {
    // Optimistic UI update logic would go here
  }

  function handleDndFinalize(columnId: string, e: CustomEvent) {
    // API call to update issue status would go here
  }
</script>

<div class="flex space-x-4 h-[calc(100vh-150px)] overflow-x-auto pb-4">
  {#each columns as column (column.id)}
    <div class="w-80 flex-shrink-0 flex flex-col space-y-2 bg-muted/50 p-3 rounded-lg">
      <h3 class="font-semibold px-2">{column.title}</h3>
      <div 
        class="flex-1 space-y-2 min-h-[50px]"
        use:dndzone={{items: column.items, flipDurationMs: 200}}
        onconsider={(e) => handleDndConsider(column.id, e)}
        onfinalize={(e) => handleDndFinalize(column.id, e)}
      >
        {#each column.items as item (item.id)}
          <div animate:flip={{duration: 200}}>
            <Card.Root>
              <Card.Content class="p-3 text-sm">
                {item.title}
              </Card.Content>
            </Card.Root>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
```

- [ ] **Step 3: Commit**
Run: `git add apps/svelte-web/src/lib/components/issues/IssueBoard.svelte && git commit -m "feat(web): add issue board view with dnd support"`

---

### Task 4: Integrate Views into Main Page

**Files:**
- Modify: `apps/svelte-web/src/routes/issues/+page.svelte`

- [x] **Step 1: Import and use the new view components**
```svelte
<!-- apps/svelte-web/src/routes/issues/+page.svelte -->
<script lang="ts">
  import { useWorkspaceStore, useIssueStore } from "@multica/core/svelte";
  import { Button } from "$lib/components/ui/button";
  import IssueList from "$lib/components/issues/IssueList.svelte";
  import IssueBoard from "$lib/components/issues/IssueBoard.svelte";

  const workspaceStore = useWorkspaceStore();
  const issueStore = useIssueStore();

  let view = $state<"board" | "list">("board");
  
  const issues = $derived(issueStore.getIssues(workspaceStore.activeWorkspaceId || ""));

  $effect(() => {
    if (workspaceStore.activeWorkspaceId) {
      issueStore.fetchIssues(workspaceStore.activeWorkspaceId);
    }
  });
</script>

<div class="p-6 space-y-4">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold">Issues</h1>
    <div class="flex space-x-2">
      <Button variant={view === "board" ? "default" : "outline"} onclick={() => view = "board"}>Board</Button>
      <Button variant={view === "list" ? "default" : "outline"} onclick={() => view = "list"}>List</Button>
    </div>
  </div>

  {#if view === "board"}
    <IssueBoard {issues} />
  {:else}
    <IssueList {issues} />
  {/if}
</div>
```

- [x] **Step 2: Commit**
Run: `git add apps/svelte-web/src/routes/issues/+page.svelte && git commit -m "feat(web): integrate board and list views into issues page"`
