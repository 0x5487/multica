import type { SvelteApiClient } from './api-client.svelte';

export class WorkspaceStore {
  workspaces = $state.raw<any[]>([]);
  activeWorkspaceId = $state<string | null>(null);
  loading = $state(false);

  constructor(private api: SvelteApiClient) {}

  async fetchWorkspaces() {
    this.loading = true;
    try {
      const data = await this.api.request<any[]>('/workspaces');
      this.workspaces = data;
    } catch (e) {
      console.error("Failed to fetch workspaces:", e);
      this.workspaces = [];
    } finally {
      this.loading = false;
    }
  }

  setActiveWorkspace(id: string) {
    this.activeWorkspaceId = id;
  }
}
