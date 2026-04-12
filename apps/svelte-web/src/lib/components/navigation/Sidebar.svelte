<script lang="ts">
  import { page } from "$app/state";
  import { useWorkspaceStore } from "@multica/core/svelte";

  const workspaceStore = useWorkspaceStore();
  let menuOpen = $state(false);
  const activeWorkspaceName = $derived(
    workspaceStore.workspaces.find((ws) => ws.id === workspaceStore.activeWorkspaceId)?.name || "Select Workspace",
  );
  const currentPath = $derived(page.url.pathname);

  const personalNav = [
    { href: "/inbox", label: "Inbox" },
  ];

  const workspaceNav = [
    { href: "/issues", label: "Issues" },
    { href: "/agents", label: "Agents" },
  ];

  function isActive(href: string) {
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function selectWorkspace(id: string) {
    workspaceStore.setActiveWorkspace(id);
    menuOpen = false;
  }
</script>

<aside class="flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-[1.25rem] border bg-sidebar text-sidebar-foreground shadow-sm">
  <div class="border-b px-3 py-3">
    <div class="group/menu relative">
      <button
        type="button"
        id="workspace-switcher"
        class="inline-flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sidebar-accent"
        onclick={toggleMenu}
        aria-expanded={menuOpen}
      >
        <div class="min-w-0">
          <div class="truncate font-medium">{activeWorkspaceName}</div>
        </div>
        <span class="text-[10px] text-muted-foreground">▼</span>
      </button>

      <div
        class={[
          "popover absolute left-0 top-[calc(100%+0.5rem)] z-20 w-full rounded-xl border bg-popover p-2 shadow-lg",
          "hidden group-focus-within/menu:block",
          menuOpen ? "block" : "",
        ]}
      >
        <div class="px-2 py-1 text-xs text-muted-foreground">
          Workspaces
        </div>
        {#each workspaceStore.workspaces as ws}
          <button
            type="button"
            class={[
              "flex w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-muted",
              ws.id === workspaceStore.activeWorkspaceId ? "bg-muted font-medium" : "",
            ]}
            onclick={() => selectWorkspace(ws.id)}
          >
            {ws.name}
          </button>
        {/each}
        <div class="my-2 h-px bg-border"></div>
        <a class="flex rounded-lg px-2 py-2 text-sm hover:bg-muted" href="/settings">Settings</a>
        <form method="POST" action="/logout" class="mt-1">
          <button type="submit" class="flex w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-muted">
            Sign out
          </button>
        </form>
      </div>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto px-3 py-4">
    <nav class="space-y-5">
      <section class="space-y-1">
        <div class="px-3 pb-1 text-xs text-muted-foreground">Personal</div>
        {#each personalNav as item}
          <a
            href={item.href}
            class={[
              "flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive(item.href) ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "",
            ]}
          >
            {item.label}
          </a>
        {/each}
      </section>

      <section class="space-y-1">
        <div class="px-3 pb-1 text-xs text-muted-foreground">Workspace</div>
        {#each workspaceNav as item}
          <a
            href={item.href}
            class={[
              "flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive(item.href) ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "",
            ]}
          >
            {item.label}
          </a>
        {/each}
      </section>
    </nav>
  </div>

  <div class="border-t px-3 py-3">
    <a
      href="/settings"
      class={[
        "flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive("/settings") ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "",
      ]}
    >
      Settings
    </a>
    <form method="POST" action="/logout" class="mt-1">
      <button
        type="submit"
        class="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        Sign out
      </button>
    </form>
  </div>
</aside>
