<script lang="ts">
  import { useApi, useWorkspaceStore } from "@multica/core/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  let { form } = $props();

  const api = useApi();
  const workspaceStore = useWorkspaceStore();

  let name = $state("");
  let members = $state<{ id: string; name: string; email: string; role: string }[]>([]);
  let syncedWorkspaceId = $state<string | null>(null);
  const saved = $derived(Boolean(form?.saved));

  $effect(() => {
    const workspace = workspaceStore.workspaces.find((ws) => ws.id === workspaceStore.activeWorkspaceId);
    if (!workspace) return;
    if (workspace.id !== syncedWorkspaceId) {
      syncedWorkspaceId = workspace.id;
      name = workspace.name;
    }
  });

  $effect(() => {
    const workspaceId = workspaceStore.activeWorkspaceId;
    if (!workspaceId) return;

    api.listMembers(workspaceId).then((data) => {
      members = data;
    }).catch(() => {
      members = [];
    });
  });

  $effect(() => {
    if (form?.saved && form.workspace) {
      workspaceStore.updateWorkspace(form.workspace);
      name = form.workspace.name;
      syncedWorkspaceId = form.workspace.id;
    }
  });
</script>

<div class="space-y-6 p-8">
  <div>
    <h1 class="text-3xl font-semibold">Settings</h1>
    <p class="mt-1 text-sm text-muted-foreground">Manage workspace details and members.</p>
  </div>

  <section class="rounded-2xl border bg-card p-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold">Workspace</h2>
        <p class="mt-1 text-sm text-muted-foreground">Update the current workspace name.</p>
      </div>
      {#if saved}
        <div class="text-sm font-medium text-foreground">Saved!</div>
      {/if}
    </div>
    <form method="POST" class="mt-4 flex max-w-xl items-end gap-3">
      <input type="hidden" name="workspace_id" value={workspaceStore.activeWorkspaceId ?? ""} />
      <div class="flex-1 space-y-2">
        <label class="text-sm font-medium" for="workspace-name">Name</label>
        <Input id="workspace-name" bind:value={name} name="name" type="text" />
      </div>
      <Button disabled={!name.trim()} type="submit">Save</Button>
    </form>
  </section>

  <section class="rounded-2xl border bg-card p-6">
    <h2 class="text-xl font-semibold">Members</h2>
    <div class="mt-4 space-y-3">
      {#each members as member (member.id)}
        <div class="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3 text-sm">
          <div>
            <div class="font-medium">{member.name}</div>
            <div class="text-muted-foreground">{member.email}</div>
          </div>
          <div class="uppercase tracking-[0.12em] text-muted-foreground">{member.role}</div>
        </div>
      {/each}
    </div>
  </section>
</div>
