<script lang="ts">
  import type { Issue, IssueStatus } from "@multica/core/types";
  import { Plus, MoreHorizontal } from "lucide-svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  let { issues = [] as Issue[], oncreate } = $props<{
    issues?: Issue[];
    oncreate?: (status: IssueStatus) => void;
  }>();

  // ── Status config (mirrors packages/core/issues/config/status.ts) ──────────
  type StatusCfg = {
    label: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    columnBg: string;
    dot: string;
  };

  const STATUS_CONFIG: Record<IssueStatus, StatusCfg> = {
    backlog:     { label: "Backlog",     iconColor: "text-muted-foreground", badgeBg: "bg-muted",        badgeText: "text-muted-foreground", columnBg: "bg-muted/40",       dot: "bg-muted-foreground/60" },
    todo:        { label: "Todo",        iconColor: "text-muted-foreground", badgeBg: "bg-muted",        badgeText: "text-muted-foreground", columnBg: "bg-muted/40",       dot: "bg-muted-foreground/60" },
    in_progress: { label: "In Progress", iconColor: "text-warning",          badgeBg: "bg-warning",      badgeText: "text-white",            columnBg: "bg-warning/5",      dot: "bg-warning" },
    in_review:   { label: "In Review",   iconColor: "text-success",          badgeBg: "bg-success",      badgeText: "text-white",            columnBg: "bg-success/5",      dot: "bg-success" },
    done:        { label: "Done",        iconColor: "text-info",             badgeBg: "bg-info",         badgeText: "text-white",            columnBg: "bg-info/5",         dot: "bg-info" },
    blocked:     { label: "Blocked",     iconColor: "text-destructive",      badgeBg: "bg-destructive",  badgeText: "text-white",            columnBg: "bg-destructive/5",  dot: "bg-destructive" },
    cancelled:   { label: "Cancelled",   iconColor: "text-muted-foreground", badgeBg: "bg-muted",        badgeText: "text-muted-foreground", columnBg: "bg-muted/40",       dot: "bg-muted-foreground/60" },
  };

  const BOARD_STATUSES: IssueStatus[] = [
    "backlog",
    "todo",
    "in_progress",
    "in_review",
    "done",
    "blocked",
  ];

  const columns = $derived(
    BOARD_STATUSES.map((status) => ({
      status,
      cfg: STATUS_CONFIG[status],
      items: issues.filter((i: Issue) => i.status === status),
    })),
  );
</script>

<!-- Outer container: fills remaining height after the two header bars -->
<div class="flex flex-1 min-h-0 gap-4 overflow-x-auto p-4">
  {#each columns as col (col.status)}
    {@const cfg = col.cfg}
    <div class="flex w-[280px] shrink-0 flex-col rounded-xl {cfg.columnBg} p-2">

      <!-- Column header -->
      <div class="mb-2 flex items-center justify-between px-1.5">
        <!-- Left: status badge + count -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold {cfg.badgeBg} {cfg.badgeText}">
            <!-- Status dot icon -->
            <span class="size-2 rounded-full {cfg.dot}"></span>
            {cfg.label}
          </span>
          <span class="text-xs text-muted-foreground">{col.items.length}</span>
        </div>

        <!-- Right: … menu + + button -->
        <div class="flex items-center gap-0.5">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              class="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <MoreHorizontal class="size-3.5" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item class="text-xs text-muted-foreground">
                Hide column
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <button
            type="button"
            title="Add issue"
            onclick={() => oncreate?.(col.status)}
            class="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Plus class="size-3.5" />
          </button>
        </div>
      </div>

      <!-- Column body -->
      <div class="min-h-[200px] flex-1 space-y-2 overflow-y-auto rounded-lg p-1">
        {#each col.items as issue (issue.id)}
          <a
            href="/issues/{issue.id}"
            class="group block rounded-lg border bg-card p-3.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-shadow hover:shadow-sm"
          >
            <!-- Identifier -->
            <p class="text-xs text-muted-foreground">{issue.identifier}</p>
            <!-- Title -->
            <p class="mt-1 text-sm font-medium leading-snug line-clamp-2">{issue.title}</p>
            <!-- Footer row: priority badge if present -->
            {#if issue.priority && issue.priority !== "no_priority"}
              <div class="mt-3 flex items-center gap-2">
                <span class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                  — {issue.priority.replace("_", " ")}
                </span>
              </div>
            {:else if !issue.priority || issue.priority === "no_priority"}
              <div class="mt-3 flex items-center gap-2">
                <span class="text-xs text-muted-foreground">— No priority</span>
              </div>
            {/if}
          </a>
        {/each}

        {#if col.items.length === 0}
          <p class="py-8 text-center text-xs text-muted-foreground">No issues</p>
        {/if}
      </div>
    </div>
  {/each}
</div>
