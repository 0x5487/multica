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
