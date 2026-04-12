<script lang="ts">
  import "../app.css";
  import { setCoreContext } from "@multica/core/svelte";
  import { onMount } from "svelte";

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

{@render children()}
