import { ApiClient } from '../api/client';
import type { LoginResponse } from '../api/client';

export class SvelteApiClient extends ApiClient {
  protected override _token = $state<string | null>(null);

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(path, options);
  }
}
