import { ApiClient } from '../api/client';

export class SvelteApiClient extends ApiClient {
  protected override _token = $state<string | null>(null);

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(path, options);
  }
}
