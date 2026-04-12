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
