import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    // Simulate authentication
    const mockToken = "mock-token-" + Date.now();
    cookies.set('multica_token', mockToken, { path: '/' });

    throw redirect(303, '/');
  }
};
