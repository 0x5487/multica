import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ cookies }) => {
    cookies.delete('multica_token', { path: '/' });
    throw redirect(303, '/login');
  }
};
