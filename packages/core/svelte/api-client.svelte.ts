import { ApiClient } from '../api/client';

export class SvelteApiClient extends ApiClient {
  token = $state<string | null>(null);

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  setToken(token: string | null) {
    this.token = token;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    // Using _baseUrl from base class as baseUrl getter is missing in current ApiClient
    const response = await fetch(`${this._baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const api = new SvelteApiClient('/api');
