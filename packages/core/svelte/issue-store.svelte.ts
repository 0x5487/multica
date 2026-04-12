import type { SvelteApiClient } from './api-client.svelte';

export class IssueStore {
  issuesByWorkspace = $state.raw<Record<string, any[]>>({});
  loading = $state(false);

  constructor(private api: SvelteApiClient) {}

  async fetchIssues(workspaceId: string) {
    this.loading = true;
    try {
      const data = await this.api.listIssues({ workspace_id: workspaceId });
      this.issuesByWorkspace = {
        ...this.issuesByWorkspace,
        [workspaceId]: data.issues
      };
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      this.loading = false;
    }
  }

  getIssues(workspaceId: string) {
    return this.issuesByWorkspace[workspaceId] || [];
  }
}
