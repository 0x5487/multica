import { api } from './api-client.svelte';

export class WorkspaceStore {
  workspaces = $state.raw<any[]>([]);
  activeWorkspaceId = $state<string | null>(null);
  loading = $state(false);

  async fetchWorkspaces() {
    this.loading = true;
    try {
      const data = await api.request<any[]>('/workspaces');
      this.workspaces = data;
    } finally {
      this.loading = false;
    }
  }

  setActiveWorkspace(id: string) {
    this.activeWorkspaceId = id;
  }
}

export const workspaceStore = new WorkspaceStore();
