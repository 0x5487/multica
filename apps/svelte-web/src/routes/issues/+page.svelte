<script lang="ts">
  import { useWorkspaceStore, useIssueStore } from "@multica/core/svelte";
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
    <div class="text-muted-foreground">Board view coming soon...</div>
  {:else}
    <div class="text-muted-foreground">List view coming soon...</div>
  {/if}
</div>
