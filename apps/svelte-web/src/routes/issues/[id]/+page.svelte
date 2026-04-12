<script lang="ts">
  import type { Comment, Issue } from "@multica/core/types";
  import { useApi, useWorkspaceStore } from "@multica/core/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  let { data } = $props();

  const api = useApi();
  const workspaceStore = useWorkspaceStore();

  let issue = $state<Issue | null>(null);
  let comments = $state<Comment[]>([]);
  let commentText = $state("");
  let loading = $state(true);

  async function loadIssue() {
    loading = true;
    try {
      issue = await api.getIssue(data.issueId);
      comments = await api.listComments(data.issueId);
    } finally {
      loading = false;
    }
  }

  async function submitComment() {
    if (!commentText.trim()) return;
    const created = await api.createComment(data.issueId, commentText.trim());
    comments = [...comments, created];
    commentText = "";
  }

  $effect(() => {
    if (workspaceStore.activeWorkspaceId) {
      loadIssue();
    }
  });
</script>

<div class="p-8">
  <div class="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
    <a href="/issues" class="hover:text-foreground hover:underline">Issues</a>
    <span>/</span>
    <span>{issue?.identifier ?? "Issue"}</span>
  </div>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
    <section class="space-y-6">
      <div class="rounded-2xl border bg-card p-6">
        {#if loading}
          <div class="text-sm text-muted-foreground">Loading issue...</div>
        {:else if issue}
          <div>
            <div class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {issue.identifier}
            </div>
            <h1 class="mt-2 text-3xl font-semibold">{issue.title}</h1>
          </div>
        {/if}
      </div>

      <div class="rounded-2xl border bg-card p-6">
        <h2 class="text-lg font-semibold">Activity</h2>
        <div class="mt-4 space-y-3">
          {#each comments as comment (comment.id)}
            <div class="rounded-xl border bg-muted/30 px-4 py-3 text-sm">
              {comment.content}
            </div>
          {/each}
        </div>
        <form
          class="mt-6 space-y-3"
          onsubmit={(event) => {
            event.preventDefault();
            submitComment();
          }}
        >
          <Input
            bind:value={commentText}
            placeholder="Leave a comment..."
          />
          <div class="flex justify-end">
            <Button type="submit" disabled={!commentText.trim()}>Add comment</Button>
          </div>
        </form>
      </div>
    </section>

    <aside class="rounded-2xl border bg-card p-6">
      <h2 class="text-lg font-semibold">Properties</h2>
      {#if issue}
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-4">
            <dt class="text-muted-foreground">Status</dt>
            <dd>{issue.status}</dd>
          </div>
          <div class="flex items-center justify-between gap-4">
            <dt class="text-muted-foreground">Priority</dt>
            <dd>{issue.priority}</dd>
          </div>
        </dl>
      {:else}
        <div class="mt-4 text-sm text-muted-foreground">Loading sidebar…</div>
      {/if}
    </aside>
  </div>
</div>
