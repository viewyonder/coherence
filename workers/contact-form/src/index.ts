interface Env {
  TURNSTILE_SECRET_KEY: string;
  BREVO_API_KEY: string;
  RECIPIENT_EMAIL: string;
  SENDER_EMAIL: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://coherence.viewyonder.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    let body: { name?: string; email?: string; message?: string; token?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const { name, email, message, token } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim() || !token) {
      return json({ error: 'All fields are required.' }, 400);
    }

    // Validate Turnstile token
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || undefined,
      }),
    });

    const turnstileData = await turnstileRes.json() as { success: boolean };
    if (!turnstileData.success) {
      return json({ error: 'Verification failed. Please try again.' }, 403);
    }

    // Send email via Brevo (SendinBlue)
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Coherence Contact Form', email: env.SENDER_EMAIL },
        to: [{ email: env.RECIPIENT_EMAIL }],
        replyTo: { email: email.trim(), name: name.trim() },
        subject: `Contact: ${name.trim()}`,
        textContent: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    });

    if (!emailRes.ok) {
      console.error('Brevo error:', await emailRes.text());
      return json({ error: 'Failed to send message. Please try again later.' }, 500);
    }

    return json({ ok: true }, 200);
  },
};

function json(data: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
