<script lang="ts">
  import type { Agent } from "@multica/core/types";
  import { useApi, useWorkspaceStore } from "@multica/core/svelte";

  const api = useApi();
  const workspaceStore = useWorkspaceStore();
  let agents = $state<Agent[]>([]);

  $effect(() => {
    const workspaceId = workspaceStore.activeWorkspaceId;
    if (!workspaceId) return;

    api.listAgents({ workspace_id: workspaceId }).then((data) => {
      agents = data;
    }).catch(() => {
      agents = [];
    });
  });
</script>

<div class="space-y-6 p-8">
  <div>
    <h1 class="text-3xl font-semibold">Agents</h1>
    <p class="mt-1 text-sm text-muted-foreground">Workspace agents and their current status.</p>
  </div>

  <section class="rounded-2xl border bg-card p-6">
    {#if agents.length === 0}
      <div class="text-sm text-muted-foreground">No agents found.</div>
    {:else}
      <div class="space-y-3">
        {#each agents as agent (agent.id)}
          <div class="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
            <div>
              <div class="font-medium">{agent.name}</div>
              <div class="text-sm text-muted-foreground">{agent.description}</div>
            </div>
            <div class="text-sm capitalize text-muted-foreground">{agent.status}</div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
