<script lang="ts">
  import "../app.css";
  import { setCoreContext } from "@multica/core/svelte";
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";

  let { data, children } = $props();
  
  // Initialize Core Context (per-session)
  const { api, workspaceStore } = setCoreContext("/api");

  // Sync token from data (both server and client)
  api.setToken(data.token);

  $effect(() => {
    // Keep token in sync if it changes on the client
    api.setToken(data.token);
    
    // Auto-fetch workspaces on login/initial mount
    if (data.token) {
      workspaceStore.fetchWorkspaces();
    }
  });
</script>

<div class="flex h-screen overflow-hidden">
  {#if data.token}
    <Sidebar />
  {/if}
  <main class="flex-1 overflow-y-auto">
    {@render children()}
  </main>
</div>
