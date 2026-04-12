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

<div class="flex h-screen w-full overflow-hidden bg-background">
  {#if data.token}
    <Sidebar />
  {/if}
  <main class="flex-1 h-full overflow-y-auto">
    {@render children()}
  </main>
</div>
