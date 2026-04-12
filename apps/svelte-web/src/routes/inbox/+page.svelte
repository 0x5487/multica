<script lang="ts">
  import type { InboxItem } from "@multica/core/types";
  import { useApi, useWorkspaceStore } from "@multica/core/svelte";

  const api = useApi();
  const workspaceStore = useWorkspaceStore();
  let items = $state<InboxItem[]>([]);

  $effect(() => {
    if (!workspaceStore.activeWorkspaceId) return;

    api.listInbox().then((data) => {
      items = data;
    }).catch(() => {
      items = [];
    });
  });
</script>

<div class="space-y-6 p-8">
  <div>
    <h1 class="text-3xl font-semibold">Inbox</h1>
    <p class="mt-1 text-sm text-muted-foreground">Recent notifications and activity.</p>
  </div>

  <section class="rounded-2xl border bg-card p-6">
    {#if items.length === 0}
      <div class="text-sm text-muted-foreground">No inbox items.</div>
    {:else}
      <div class="space-y-3">
        {#each items as item (item.id)}
          <div class="rounded-xl border bg-muted/30 px-4 py-3 text-sm">
            {item.title}
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
