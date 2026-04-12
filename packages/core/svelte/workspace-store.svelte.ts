import type { SvelteApiClient } from './api-client.svelte';
import type { Workspace } from '../types';

export class WorkspaceStore {
  workspaces = $state<Workspace[]>([]);
  activeWorkspaceId = $state<string | null>(null);
  loading = $state(false);
  private fetchVersion = 0;

  constructor(private api: SvelteApiClient) {}

  async fetchWorkspaces() {
    const requestVersion = ++this.fetchVersion;
    this.loading = true;
    try {
      const data = await this.api.listWorkspaces();
      if (requestVersion !== this.fetchVersion) return;
      this.workspaces = data || [];
      const preferredId =
        this.activeWorkspaceId ||
        (typeof window !== 'undefined' ? localStorage.getItem('multica_workspace_id') : null);
      const nextWorkspace =
        (preferredId ? this.workspaces.find((workspace) => workspace.id === preferredId) : null) ||
        this.workspaces[0] ||
        null;

      this.setActiveWorkspace(nextWorkspace?.id ?? null);
    } catch (e) {
      console.error("Failed to fetch workspaces:", e);
      this.workspaces = [];
      this.setActiveWorkspace(null);
    } finally {
      this.loading = false;
    }
  }

  setActiveWorkspace(id: string | null) {
    this.activeWorkspaceId = id;
    this.api.setWorkspaceId(id);
  }

  updateWorkspace(workspace: Workspace) {
    this.fetchVersion += 1;
    this.workspaces = this.workspaces.map((item) =>
      item.id === workspace.id ? { ...item, ...workspace } : item,
    );
  }
}
