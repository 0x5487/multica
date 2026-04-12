import { ApiClient } from '../api/client';

export class SvelteApiClient extends ApiClient {
  token = $state<string | null>(null);

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  setToken(token: string | null) {
    this.token = token;
    super.setToken(token);
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}
