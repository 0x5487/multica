import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const code = data.get('code') as string;

    const backendUrl = process.env.REMOTE_API_URL || 'http://localhost:8080';

    // 1. Send code request to backend
    await fetch(`${backendUrl}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    // 2. Verify code request (using the code from form, or 888888 for dev)
    const verifyRes = await fetch(`${backendUrl}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: code || '888888' })
    });

    if (!verifyRes.ok) {
      console.error("Verify failed", await verifyRes.text());
      return { error: 'Invalid verification code' };
    }

    const verifyData = await verifyRes.json();
    
    if (verifyData.token) {
      cookies.set('multica_token', verifyData.token, { path: '/', httpOnly: true, secure: false });
      throw redirect(303, '/issues');
    }

    return { error: 'Failed to retrieve token' };
  }
};
