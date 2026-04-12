<script lang="ts">
  import type { Issue } from "@multica/core/types";
  import { useApi, useWorkspaceStore, useIssueStore } from "@multica/core/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import IssueList from "$lib/components/issues/IssueList.svelte";
  import IssueBoard from "$lib/components/issues/IssueBoard.svelte";

  const api = useApi();
  const workspaceStore = useWorkspaceStore();
  const issueStore = useIssueStore();

  let view = $state<"board" | "list">("board");
  let issueTitle = $state("");
  let isSubmitting = $state(false);
  let createdIssue = $state<Issue | null>(null);
  let createPopover = $state<HTMLElement | null>(null);

  const issues = $derived(issueStore.getIssues(workspaceStore.activeWorkspaceId || ""));

  $effect(() => {
    if (workspaceStore.activeWorkspaceId) {
      issueStore.fetchIssues(workspaceStore.activeWorkspaceId);
    }
  });

  async function createIssue() {
    if (!workspaceStore.activeWorkspaceId || !issueTitle.trim()) return;

    isSubmitting = true;
    try {
      const issue = await api.createIssue({ title: issueTitle.trim() });
      issueStore.issuesByWorkspace = {
        ...issueStore.issuesByWorkspace,
        [workspaceStore.activeWorkspaceId]: [issue, ...issues],
      };
      createdIssue = issue;
      issueTitle = "";
      createPopover?.hidePopover?.();
    } finally {
      isSubmitting = false;
    }
  }

  function goToIssue(issueId: string) {
    window.location.href = `/issues/${issueId}`;
  }
</script>

<div class="space-y-6 p-8">
  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <div class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {workspaceStore.workspaces.find((ws) => ws.id === workspaceStore.activeWorkspaceId)?.name || "Workspace"}
      </div>
      <h1 class="text-3xl font-semibold">Issues</h1>
      <p class="text-sm text-muted-foreground">All Issues</p>
    </div>
    <div class="flex items-center space-x-2">
      <Button popovertarget="new-issue-popover">New Issue</Button>
      <Button variant={view === "board" ? "default" : "outline"} onclick={() => view = "board"}>Board</Button>
      <Button variant={view === "list" ? "default" : "outline"} onclick={() => view = "list"}>List</Button>
    </div>
  </div>

  {#if createdIssue}
    <div class="rounded-2xl border bg-secondary/40 p-4">
      <div class="font-medium">Issue created</div>
      <div role="region" aria-label="Notifications" class="mt-2 flex items-center justify-between gap-4">
        <div class="truncate text-sm">{createdIssue.title}</div>
        <Button size="sm" onclick={() => goToIssue(createdIssue!.id)}>View issue</Button>
      </div>
    </div>
  {/if}

  <div
    bind:this={createPopover}
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
      <Input
        bind:value={issueTitle}
        id="issue-title"
        aria-label="Issue title"
        placeholder="Issue title"
      />
      <div class="flex justify-end gap-2">
        <Button
          variant="outline"
          popovertarget="new-issue-popover"
          popovertargetaction="hide"
          onclick={() => issueTitle = ""}
        >
          Cancel
        </Button>
        <Button disabled={isSubmitting || !issueTitle.trim()} onclick={createIssue}>
          {isSubmitting ? "Creating..." : "Create Issue"}
        </Button>
      </div>
    </div>
  </div>

  {#if view === "board"}
    <IssueBoard {issues} />
  {:else}
    <IssueList {issues} />
  {/if}
</div>
