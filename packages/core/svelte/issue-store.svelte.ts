import type { SvelteApiClient } from './api-client.svelte';

export class IssueStore {
  issuesByWorkspace = $state.raw<Record<string, any[]>>({});
  loading = $state(false);

  constructor(private api: SvelteApiClient) {}

  async fetchIssues(workspaceId: string) {
    if (this.issuesByWorkspace[workspaceId]) return; // Simple cache

    this.loading = true;
    try {
      const data = await this.api.request<any[]>(`/workspaces/${workspaceId}/issues`);
      this.issuesByWorkspace = {
        ...this.issuesByWorkspace,
        [workspaceId]: data
      };
    } finally {
      this.loading = false;
    }
  }

  getIssues(workspaceId: string) {
    return this.issuesByWorkspace[workspaceId] || [];
  }
}
