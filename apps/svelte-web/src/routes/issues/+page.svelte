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
