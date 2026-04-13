<script lang="ts">
  import { useApi, useWorkspaceStore, useIssueStore } from "@multica/core/svelte";
  import { Button } from "$lib/components/ui/button";
  import IssueList from "$lib/components/issues/IssueList.svelte";
  import IssueBoard from "$lib/components/issues/IssueBoard.svelte";
  import { ChevronRight, ListTodo, Columns3, List, Filter } from "lucide-svelte";

  const api = useApi();
  const workspaceStore = useWorkspaceStore();
  const issueStore = useIssueStore();

  // ── Display state ──────────────────────────────────────────────────────────
  type Scope = "all" | "members" | "agents";
  type ViewMode = "board" | "list";

  let scope = $state<Scope>("all");
  let viewMode = $state<ViewMode>("board");

  const SCOPES: { value: Scope; label: string }[] = [
    { value: "all", label: "All" },
    { value: "members", label: "Members" },
    { value: "agents", label: "Agents" },
  ];

  // ── Workspace / Issues data ────────────────────────────────────────────────
  const workspace = $derived(
    workspaceStore.workspaces.find((ws) => ws.id === workspaceStore.activeWorkspaceId) ?? null,
  );

  const allIssues = $derived(issueStore.getIssues(workspaceStore.activeWorkspaceId || ""));

  const scopedIssues = $derived.by(() => {
    if (scope === "members") return allIssues.filter((i) => i.assignee_type === "member");
    if (scope === "agents") return allIssues.filter((i) => i.assignee_type === "agent");
    return allIssues;
  });

  $effect(() => {
    if (workspaceStore.activeWorkspaceId) {
      issueStore.fetchIssues(workspaceStore.activeWorkspaceId);
    }
  });

  // ── New Issue popover ──────────────────────────────────────────────────────
  let newIssuePopover = $state<HTMLElement | null>(null);
  let issueTitle = $state("");
  let isSubmitting = $state(false);

  async function createIssue() {
    if (!workspaceStore.activeWorkspaceId || !issueTitle.trim()) return;
    isSubmitting = true;
    try {
      await api.createIssue({ title: issueTitle.trim() });
      issueTitle = "";
      newIssuePopover?.hidePopover?.();
      // Re-fetch to get the updated list (IssueStore uses $state.raw)
      await issueStore.fetchIssues(workspaceStore.activeWorkspaceId);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="flex flex-1 min-h-0 flex-col">
  <!-- Header 1: Workspace breadcrumb -->
  <div class="flex h-12 shrink-0 items-center gap-1.5 border-b px-4">
    <span
      class="flex size-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground"
    >
      {(workspace?.name ?? "W").charAt(0).toUpperCase()}
    </span>
    <span class="text-sm text-muted-foreground">
      {workspace?.name ?? "Workspace"}
    </span>
    <ChevronRight class="h-3 w-3 text-muted-foreground" />
    <span class="text-sm font-medium">Issues</span>
  </div>

  <!-- Header 2: Scope tabs + view controls -->
  <div class="flex h-12 shrink-0 items-center justify-between border-b px-4">
    <!-- Left: scope buttons (All / Members / Agents) -->
    <div class="flex items-center gap-1">
      {#each SCOPES as s (s.value)}
        <Button
          variant="outline"
          size="sm"
          class={scope === s.value
            ? "bg-accent text-accent-foreground hover:bg-accent/80"
            : "text-muted-foreground"}
          onclick={() => (scope = s.value)}
        >
          {s.label}
        </Button>
      {/each}
    </div>

    <!-- Right: view toggle -->
    <div class="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        class="text-muted-foreground"
        popovertarget="new-issue-popover"
      >
        New Issue
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        class="text-muted-foreground"
        onclick={() => (viewMode = "board")}
        title="Board view"
      >
        <Columns3 class="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        class="text-muted-foreground"
        onclick={() => (viewMode = "list")}
        title="List view"
      >
        <List class="size-4" />
      </Button>
    </div>
  </div>

  <!-- Content -->
  {#if scopedIssues.length === 0}
    <div class="flex flex-1 min-h-0 flex-col items-center justify-center gap-2 text-muted-foreground">
      <ListTodo class="h-10 w-10 text-muted-foreground/40" />
      <p class="text-sm">No issues yet</p>
      <p class="text-xs">Create an issue to get started.</p>
    </div>
  {:else if viewMode === "board"}
    <IssueBoard issues={scopedIssues} />
  {:else}
    <IssueList issues={scopedIssues} />
  {/if}
</div>

<!-- New Issue popover -->
<div
  bind:this={newIssuePopover}
  id="new-issue-popover"
  popover
  class="backdrop:bg-black/40 w-[min(32rem,calc(100vw-2rem))] rounded-2xl border bg-background p-6 shadow-xl"
>
  <div class="space-y-1">
    <h2 class="text-xl font-semibold">New Issue</h2>
    <p class="text-sm text-muted-foreground">Create a new issue in the current workspace.</p>
  </div>
  <div class="mt-4 space-y-4">
    <label class="block space-y-2" for="issue-title">
      <span class="text-sm font-medium">Issue title</span>
    </label>
    <input
      bind:value={issueTitle}
      id="issue-title"
      type="text"
      placeholder="Issue title"
      class="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring/50"
    />
    <div class="flex justify-end gap-2">
      <Button
        variant="outline"
        popovertarget="new-issue-popover"
        popovertargetaction="hide"
        onclick={() => (issueTitle = "")}
      >
        Cancel
      </Button>
      <Button disabled={isSubmitting || !issueTitle.trim()} onclick={createIssue}>
        {isSubmitting ? "Creating..." : "Create Issue"}
      </Button>
    </div>
  </div>
</div>
