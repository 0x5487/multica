import { setContext, getContext } from 'svelte';
import { SvelteApiClient } from './api-client.svelte';
import { WorkspaceStore } from './workspace-store.svelte';
import { IssueStore } from './issue-store.svelte';

const CLIENT_KEY = Symbol('client');
const WORKSPACE_KEY = Symbol('workspace');
const ISSUE_KEY = Symbol('issue');

export function setCoreContext(baseUrl: string) {
  const api = new SvelteApiClient(baseUrl);
  const workspaceStore = new WorkspaceStore(api);
  const issueStore = new IssueStore(api);

  setContext(CLIENT_KEY, api);
  setContext(WORKSPACE_KEY, workspaceStore);
  setContext(ISSUE_KEY, issueStore);

  return { api, workspaceStore, issueStore };
}

export function useApi() { return getContext<SvelteApiClient>(CLIENT_KEY); }
export function useWorkspaceStore() { return getContext<WorkspaceStore>(WORKSPACE_KEY); }
export function useIssueStore() { return getContext<IssueStore>(ISSUE_KEY); }
