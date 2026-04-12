<script lang="ts">
  import { useWorkspaceStore } from "@multica/core/svelte";
  import { Button } from "$lib/components/ui/button";

  const workspaceStore = useWorkspaceStore();
</script>

<aside class="w-64 border-r h-full flex flex-col bg-muted/30 shrink-0">
  <div class="p-4 font-bold border-b">Multica Svelte</div>
  <nav class="flex-1 p-2 space-y-1 overflow-y-auto">
    {#if workspaceStore.loading}
      <div class="p-4 text-xs text-muted-foreground italic">Loading workspaces...</div>
    {:else if workspaceStore.workspaces.length === 0}
      <div class="p-4 text-xs text-muted-foreground italic">No workspaces found</div>
    {:else}
      {#each workspaceStore.workspaces as ws}
        <Button 
          variant={workspaceStore.activeWorkspaceId === ws.id ? "secondary" : "ghost"} 
          class="w-full justify-start" 
          onclick={() => workspaceStore.setActiveWorkspace(ws.id)}
        >
          {ws.name}
        </Button>
      {/each}
    {/if}
  </nav>
  <div class="p-4 border-t">
    <form method="POST" action="/logout">
      <Button type="submit" variant="outline" class="w-full">Logout</Button>
    </form>
  </div>
</aside>
