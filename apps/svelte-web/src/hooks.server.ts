import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('multica_token');
  
  if (event.url.pathname.startsWith('/api') || event.url.pathname.startsWith('/auth') || event.url.pathname.startsWith('/ws')) {
    const backendUrl = env.REMOTE_API_URL || 'http://localhost:8080';
    const destination = `${backendUrl}${event.url.pathname}${event.url.search}`;
    
    const requestHeaders = new Headers(event.request.headers);
    if (token) {
      console.log(`[PROXY] Adding Authorization header from cookie (token starts with: ${token.substring(0, 15)}...)`);
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    // CRITICAL: Remove conflicting headers from the browser request
    requestHeaders.delete('host');
    requestHeaders.delete('connection');
    // Origin and Referer might also cause issues if the backend is strict
    requestHeaders.delete('origin');
    requestHeaders.delete('referer');

    console.log(`[PROXY] Forwarding ${event.request.method} ${destination}`);

    return fetch(destination, {
      method: event.request.method,
      headers: requestHeaders,
      body: event.request.method !== 'GET' && event.request.method !== 'HEAD' ? await event.request.arrayBuffer() : null,
      duplex: 'half'
    } as any);
  }

  // Auth Guard for UI routes
  if (!token && !event.url.pathname.startsWith('/login') && !event.url.pathname.startsWith('/_app')) {
    return new Response(null, { status: 302, headers: { Location: '/login' } });
  }

  event.locals.token = token || null;
  return await resolve(event);
};
