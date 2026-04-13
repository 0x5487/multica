<script lang="ts">
  import { page } from "$app/state";
  import { useWorkspaceStore, useApi } from "@multica/core/svelte";
  import { onMount } from "svelte";
  import type { User } from "@multica/core/types";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import {
    Inbox,
    ListTodo,
    Bot,
    Monitor,
    ChevronDown,
    Settings,
    LogOut,
    Check,
    BookOpenText,
    CircleUser,
    FolderKanban,
    Ellipsis,
    SquarePen,
    Search,
  } from "lucide-svelte";

  const workspaceStore = useWorkspaceStore();
  const api = useApi();

  let currentUser = $state<User | null>(null);

  onMount(async () => {
    try {
      currentUser = await api.getMe();
    } catch {
      // ignore — user may not be logged in yet
    }
  });

  const currentPath = $derived(page.url.pathname);

  const workspace = $derived(
    workspaceStore.workspaces.find((ws) => ws.id === workspaceStore.activeWorkspaceId) ?? null,
  );

  const personalNav = [
    { href: "/inbox", label: "Inbox", icon: Inbox },
    { href: "/my-issues", label: "My Issues", icon: CircleUser },
  ];

  const workspaceNav = [
    { href: "/issues", label: "Issues", icon: ListTodo },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/agents", label: "Agents", icon: Bot },
  ];

  const configureNav = [
    { href: "/runtimes", label: "Runtimes", icon: Monitor },
    { href: "/skills", label: "Skills", icon: BookOpenText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  function isActive(href: string) {
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }

  function selectWorkspace(id: string) {
    workspaceStore.setActiveWorkspace(id);
  }

  async function logout() {
    // Clear local storage + redirect; cookie cleared by server /logout
    localStorage.removeItem("multica_token");
    localStorage.removeItem("multica_workspace_id");
    window.location.href = "/logout";
  }

  // Global "C" shortcut to open create-issue (like Linear)
  $effect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "c" && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        const isEditable =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          (e.target as HTMLElement)?.isContentEditable;
        if (isEditable) return;
        e.preventDefault();
        document.getElementById("new-issue-trigger")?.click();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  // Workspace avatar initials
  function wsInitials(name: string) {
    return name
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
</script>

<Sidebar.Root variant="inset">
  <!-- Header: Workspace Switcher + New Issue -->
  <Sidebar.Header class="py-3">
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton {...props}>
                <span
                  class="flex size-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {wsInitials(workspace?.name ?? "M")}
                </span>
                <span class="flex-1 truncate font-medium">
                  {workspace?.name ?? "Multica"}
                </span>
                <ChevronDown class="size-3 text-muted-foreground" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56" align="start" side="bottom" sideOffset={4}>
            <DropdownMenu.Label class="text-xs text-muted-foreground">Workspaces</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              {#each workspaceStore.workspaces as ws (ws.id)}
                <DropdownMenu.Item onclick={() => selectWorkspace(ws.id)}>
                  <span
                    class="flex size-4 shrink-0 items-center justify-center rounded bg-primary text-[8px] font-bold text-primary-foreground"
                  >
                    {wsInitials(ws.name)}
                  </span>
                  <span class="flex-1 truncate">{ws.name}</span>
                  {#if ws.id === workspaceStore.activeWorkspaceId}
                    <Check class="size-3.5 text-primary" />
                  {/if}
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item
                class="text-destructive focus:text-destructive"
                onclick={logout}
              >
                <LogOut class="size-3.5" />
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>

    <Sidebar.Menu>
      <!-- Search button (⌘K) -->
      <Sidebar.MenuItem>
        <Sidebar.MenuButton class="text-muted-foreground">
          <Search />
          <span>Search...</span>
          <kbd
            class="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
          >
            <span class="text-[9px]">⌘</span>K
          </kbd>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>

      <!-- New Issue button (C shortcut) -->
      <Sidebar.MenuItem>
        <Sidebar.MenuButton
          id="new-issue-trigger"
          class="text-muted-foreground"
          onclick={() => document.getElementById("new-issue-popover")?.showPopover?.()}
        >
          <SquarePen />
          <span>New Issue</span>
          <kbd
            class="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
          >C</kbd>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>

  <!-- Navigation -->
  <Sidebar.Content>
    <!-- Personal -->
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu class="gap-0.5">
          {#each personalNav as item (item.href)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={isActive(item.href)}
                class="text-muted-foreground hover:not-data-active:bg-sidebar-accent/70 data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
              >
                {#snippet child({ props })}
                  <a href={item.href} {...props}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <!-- Workspace -->
    <Sidebar.Group>
      <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu class="gap-0.5">
          {#each workspaceNav as item (item.href)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={isActive(item.href)}
                class="text-muted-foreground hover:not-data-active:bg-sidebar-accent/70 data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
              >
                {#snippet child({ props })}
                  <a href={item.href} {...props}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <!-- Configure -->
    <Sidebar.Group>
      <Sidebar.GroupLabel>Configure</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu class="gap-0.5">
          {#each configureNav as item (item.href)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={isActive(item.href)}
                class="text-muted-foreground hover:not-data-active:bg-sidebar-accent/70 data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
              >
                {#snippet child({ props })}
                  <a href={item.href} {...props}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <!-- Footer: User panel -->
  <Sidebar.Footer class="p-2">
    <div class="border-t pt-2">
      <div class="flex items-center gap-2.5 rounded-md px-2 py-1.5">
        <div
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
        >
          {wsInitials(currentUser?.name ?? "U")}
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium leading-tight">
            {currentUser?.name ?? ""}
          </p>
          <p class="truncate text-xs text-muted-foreground leading-tight">
            {currentUser?.email ?? ""}
          </p>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            class="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Ellipsis class="size-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" side="top" sideOffset={4}>
            <DropdownMenu.Item
              class="text-destructive focus:text-destructive"
              onclick={logout}
            >
              <LogOut class="size-3.5" />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  </Sidebar.Footer>

  <Sidebar.Rail />
</Sidebar.Root>
