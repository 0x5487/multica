import { ApiClient } from '../api/client';

export class SvelteApiClient extends ApiClient {
  protected override _token = $state<string | null>(null);

  constructor(baseUrl: string) {
    super(baseUrl);
    if (typeof window !== 'undefined') {
      try {
        this._token = localStorage.getItem('multica_token');
        this._workspaceId = localStorage.getItem('multica_workspace_id');
      } catch (e) {
        console.warn('Failed to read auth state from localStorage', e);
      }
    }
  }

  override setToken(token: string | null) {
    this._token = token;
    if (typeof window !== 'undefined') {
      try {
        if (token) {
          localStorage.setItem('multica_token', token);
        } else {
          localStorage.removeItem('multica_token');
        }
      } catch (e) {
        console.error('Failed to sync token to localStorage', e);
      }
    }
  }

  override setWorkspaceId(id: string | null) {
    super.setWorkspaceId(id);
    if (typeof window !== 'undefined') {
      try {
        if (id) {
          localStorage.setItem('multica_workspace_id', id);
        } else {
          localStorage.removeItem('multica_workspace_id');
        }
      } catch (e) {
        console.error('Failed to sync workspace to localStorage', e);
      }
    }
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(path, options);
  }
}
