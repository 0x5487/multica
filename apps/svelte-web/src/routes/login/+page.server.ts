import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    // Simulate the real API call token exchange
    const token = "actual-token-" + Date.now(); 
    cookies.set('multica_token', token, { path: '/', httpOnly: true, secure: true });

    throw redirect(303, '/issues');
  }
};
