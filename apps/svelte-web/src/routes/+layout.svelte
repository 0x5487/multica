<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { setCoreContext } from "@multica/core/svelte";
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";

  let { data, children } = $props();
  
  // Initialize Core Context (per-session)
  const { api, workspaceStore } = setCoreContext("");

  onMount(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  });

  $effect(() => {
    if (data.token) {
      api.setToken(data.token);
      workspaceStore.fetchWorkspaces();
    } else {
      api.setToken(null);
    }
  });
</script>

{#if data.token}
  <div class="flex h-svh overflow-hidden bg-muted/30 p-2">
    <Sidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] border bg-background shadow-sm">
      <main class="flex-1 overflow-y-auto">
        {@render children()}
      </main>
    </div>
  </div>
{:else}
  <main class="min-h-svh bg-background">
    {@render children()}
  </main>
{/if}
