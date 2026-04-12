import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('multica_token');
  
  // If no token and not on login page, redirect (simple version)
  if (!token && !event.url.pathname.startsWith('/login')) {
    return new Response(null, { status: 302, headers: { Location: '/login' } });
  }

  // Pass token to locals for use in load functions
  event.locals.token = token || null;

  return await resolve(event);
};
