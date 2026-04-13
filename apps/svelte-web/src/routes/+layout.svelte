<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { setCoreContext } from "@multica/core/svelte";
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";
  import { SidebarProvider, SidebarInset, SidebarTrigger } from "$lib/components/ui/sidebar";
  import { Toaster } from "$lib/components/ui/sonner";

  let { data, children } = $props();

  // Initialize Core Context (per-session)
  const { api, workspaceStore } = setCoreContext("");

  onMount(() => {
    // Apply dark mode from system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
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
  <SidebarProvider class="h-svh">
    <Sidebar />
    <SidebarInset class="flex flex-col overflow-hidden">
      <!-- Mobile sidebar trigger -->
      <div class="flex h-10 shrink-0 items-center border-b px-2 md:hidden">
        <SidebarTrigger />
      </div>
      <main class="flex flex-col flex-1 min-h-0">
        {@render children()}
      </main>
    </SidebarInset>
  </SidebarProvider>
{:else}
  <main class="min-h-svh bg-background">
    {@render children()}
  </main>
{/if}

<Toaster />
