import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  try {
    const token = event.cookies.get('multica_token');
    
    // Proxy API/Auth/WS requests to backend
    if (event.url.pathname.startsWith('/api') || event.url.pathname.startsWith('/auth') || event.url.pathname.startsWith('/ws')) {
      const backendUrl = process.env.REMOTE_API_URL || 'http://localhost:8080';
      const destination = `${backendUrl}${event.url.pathname}${event.url.search}`;
      
      const requestHeaders = new Headers(event.request.headers);
      if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
      }

      // Remove hop-by-hop headers
      requestHeaders.delete('host');
      requestHeaders.delete('connection');

      return await fetch(destination, {
        method: event.request.method,
        headers: requestHeaders,
        body: event.request.method !== 'GET' && event.request.method !== 'HEAD' ? await event.request.arrayBuffer() : null,
        duplex: 'half'
      } as any);
    }

    // Auth Guard: Redirect to login if no token (except for /login and assets)
    if (!token && !event.url.pathname.startsWith('/login') && !event.url.pathname.startsWith('/_app')) {
      return new Response(null, { status: 302, headers: { Location: '/login' } });
    }

    event.locals.token = token || null;
    return await resolve(event);
  } catch (err: any) {
    console.error(`[FATAL ERROR] ${event.url.pathname}:`, err?.message, err?.stack);
    return new Response(`SvelteKit Error: ${err?.message}`, { status: 500 });
  }
};
