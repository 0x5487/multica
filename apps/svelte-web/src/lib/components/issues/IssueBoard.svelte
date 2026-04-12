<script lang="ts">
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import * as Card from "$lib/components/ui/card";
  import type { Issue } from "@multica/core/types";

  let { issues = [] as Issue[] } = $props();

  const columnsConfig = [
    { id: "backlog", title: "Backlog" },
    { id: "todo", title: "Todo" },
    { id: "in_progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ] as const;

  let columns = $derived(
    columnsConfig.map((column) => ({
      ...column,
      items: issues.filter((issue) => issue.status === column.id),
    })),
  );

  function handleDndConsider(columnId: string, e: CustomEvent) {
    // Optimistic UI update logic would go here
  }

  function handleDndFinalize(columnId: string, e: CustomEvent) {
    // API call to update issue status would go here
  }
</script>

<div class="flex h-[calc(100vh-15rem)] space-x-4 overflow-x-auto pb-4">
  {#each columns as column (column.id)}
    <div class="flex w-80 flex-shrink-0 flex-col space-y-2 rounded-2xl border bg-muted/40 p-3">
      <h3 class="px-2 font-semibold">{column.title}</h3>
      <div 
        class="min-h-[50px] flex-1 space-y-2"
        use:dndzone={{items: column.items, flipDurationMs: 200}}
        onconsider={(e) => handleDndConsider(column.id, e)}
        onfinalize={(e) => handleDndFinalize(column.id, e)}
      >
        {#each column.items as item (item.id)}
          <div animate:flip={{duration: 200}}>
            <Card.Root class="shadow-sm">
              <Card.Content class="space-y-2 p-4 text-sm">
                <a href={`/issues/${item.id}`} class="font-medium hover:underline">
                  {item.title}
                </a>
                <div class="text-xs text-muted-foreground">{item.identifier}</div>
              </Card.Content>
            </Card.Root>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
