import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('multica_token');
  
  // 1. Proxy API requests to the backend service
  if (event.url.pathname.startsWith('/api') || event.url.pathname.startsWith('/auth') || event.url.pathname.startsWith('/ws')) {
    const backendUrl = env.REMOTE_API_URL || 'http://localhost:8080';
    const destination = `${backendUrl}${event.url.pathname}${event.url.search}`;
    
    const requestHeaders = new Headers(event.request.headers);
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    return fetch(destination, {
      method: event.request.method,
      headers: requestHeaders,
      body: event.request.method !== 'GET' && event.request.method !== 'HEAD' ? await event.request.arrayBuffer() : null,
      duplex: 'half'
    } as any);
  }

  // 2. Auth Guard for UI routes
  if (!token && !event.url.pathname.startsWith('/login') && !event.url.pathname.startsWith('/_app')) {
    return new Response(null, { status: 302, headers: { Location: '/login' } });
  }

  event.locals.token = token || null;
  return await resolve(event);
};
