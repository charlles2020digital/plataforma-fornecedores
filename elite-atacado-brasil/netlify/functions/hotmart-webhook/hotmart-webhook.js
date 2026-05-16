const { createClient } = require('@supabase/supabase-js');

// Eventos da Hotmart que criam acesso
const APPROVED_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'];
// Eventos que cancelam/removem acesso
const REVOKE_EVENTS   = ['PURCHASE_REFUNDED', 'PURCHASE_CANCELED', 'PURCHASE_CHARGEBACK'];

// Gera senha segura aleatória
function generatePassword() {
  const chars  = 'abcdefghjkmnpqrstuvwxyz';
  const upper  = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const digits = '23456789';
  const spec   = '@#!';
  const pick   = s => s[Math.floor(Math.random() * s.length)];
  const base   = Array.from({length: 6}, () => pick(chars)).join('');
  return base + pick(upper) + pick(digits) + pick(spec);
}

// Template HTML do e-mail de boas-vindas
function buildEmail(name, email, password, platformUrl) {
  const firstName = name ? name.split(' ')[0] : 'Revendedor(a)';
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Seu acesso à ELITE Atacado Brasil</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Logo -->
      <tr><td align="center" style="padding-bottom:32px;">
        <svg width="52" height="39" viewBox="0 0 40 30" fill="#d4af37" xmlns="http://www.w3.org/2000/svg"
          style="filter:drop-shadow(0 0 14px rgba(212,175,55,0.5));">
          <path d="M4 22L4 13L14 20L20 2L26 20L36 13L36 22Z"/>
          <rect x="3" y="22" width="34" height="5" rx="2"/>
          <circle cx="4"  cy="13" r="3.2"/>
          <circle cx="20" cy="2"  r="3.2"/>
          <circle cx="36" cy="13" r="3.2"/>
        </svg>
        <div style="margin-top:10px;">
          <span style="display:block;font-weight:900;font-size:22px;color:#fafafa;letter-spacing:-0.04em;">ELITE</span>
          <span style="display:block;font-size:9px;color:#d4af37;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;margin-top:2px;">Atacado Brasil</span>
        </div>
      </td></tr>

      <!-- Card principal -->
      <tr><td style="background:#141414;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;">

        <!-- Faixa dourada -->
        <tr><td style="background:linear-gradient(90deg,#d4af37,#f0d05c,#d4af37);height:3px;"></td></tr>

        <!-- Conteúdo -->
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 6px;font-size:12px;color:#d4af37;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">Acesso liberado</p>
          <h1 style="margin:0 0 20px;font-size:26px;font-weight:800;color:#fafafa;letter-spacing:-0.03em;">
            Bem-vindo(a), ${firstName}!
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:#a1a1aa;line-height:1.7;">
            Seu acesso à <strong style="color:#fafafa;">ELITE Atacado Brasil</strong> foi liberado.
            Abaixo estão suas credenciais para entrar na plataforma.
          </p>

          <!-- Credenciais -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:8px;margin-bottom:28px;">
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #1c1c1c;">
                <p style="margin:0 0 4px;font-size:10px;color:#525252;letter-spacing:0.14em;text-transform:uppercase;">E-mail de acesso</p>
                <p style="margin:0;font-size:15px;color:#fafafa;font-weight:600;">${email}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;">
                <p style="margin:0 0 4px;font-size:10px;color:#525252;letter-spacing:0.14em;text-transform:uppercase;">Senha</p>
                <p style="margin:0;font-size:18px;color:#d4af37;font-weight:800;letter-spacing:0.08em;font-family:monospace;">${password}</p>
              </td>
            </tr>
          </table>

          <!-- Botão -->
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center">
              <a href="${platformUrl}" target="_blank"
                style="display:inline-block;background:#d4af37;color:#0a0a0a;font-size:13px;font-weight:800;
                       letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;
                       padding:16px 40px;border-radius:6px;">
                Acessar a plataforma →
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Dica -->
        <tr><td style="padding:20px 40px 32px;">
          <p style="margin:0;font-size:12px;color:#525252;line-height:1.6;">
            💡 <strong style="color:#737373;">Dica de segurança:</strong>
            após entrar, acesse as configurações do seu perfil para criar uma senha pessoal.
            Guarde suas credenciais em local seguro.
          </p>
        </td></tr>

        <!-- Faixa dourada inferior -->
        <tr><td style="background:linear-gradient(90deg,#d4af37,#f0d05c,#d4af37);height:1px;"></td></tr>

      </td></tr>

      <!-- Rodapé -->
      <tr><td align="center" style="padding-top:24px;">
        <p style="margin:0;font-size:11px;color:#3a3a3a;line-height:1.7;">
          ELITE Atacado Brasil &nbsp;·&nbsp; acesso vitalício<br/>
          Dúvidas? Responda este e-mail ou entre em contato no WhatsApp.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

exports.handler = async (event) => {
  // Apenas POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // ── Validação do token Hotmart ────────────────────────────────
  const hottok =
    event.headers['x-hotmart-webhook-token'] ||
    event.headers['hottok'] ||
    (event.queryStringParameters && event.queryStringParameters.hottok);

  if (!process.env.HOTMART_HOTTOK || hottok !== process.env.HOTMART_HOTTOK) {
    console.error('Webhook token inválido:', hottok);
    return { statusCode: 401, body: 'Unauthorized' };
  }

  // ── Parse do body ─────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const eventType = body.event || body.data?.purchase?.status || '';
  const buyer     = body.data?.buyer || {};
  const email     = buyer.email;
  const name      = buyer.name || '';

  console.log(`Evento recebido: ${eventType} | email: ${email}`);

  if (!email) {
    return { statusCode: 400, body: 'No buyer email' };
  }

  // ── Cliente Supabase (service role) ──────────────────────────
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // ── Revogar acesso (reembolso / cancelamento) ─────────────────
  if (REVOKE_EVENTS.includes(eventType)) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const target = users?.users?.find(u => u.email === email);
    if (target) {
      await supabase.auth.admin.updateUserById(target.id, {
        user_metadata: { active: false, revoked_at: new Date().toISOString() }
      });
      console.log(`Acesso revogado: ${email}`);
    }
    return { statusCode: 200, body: 'Revoked' };
  }

  // ── Criar acesso (compra aprovada) ────────────────────────────
  if (!APPROVED_EVENTS.includes(eventType)) {
    return { statusCode: 200, body: `Evento ignorado: ${eventType}` };
  }

  const password    = generatePassword();
  const platformUrl = process.env.PLATFORM_URL || 'https://eliteatakadobrasil.netlify.app';

  // Tenta criar usuário; se já existir, atualiza a senha
  let userId;
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, source: 'hotmart', active: true, purchased_at: new Date().toISOString() }
  });

  if (createErr) {
    if (createErr.message.includes('already been registered') || createErr.message.includes('already exists')) {
      // Usuário existe — atualiza senha e reenvia credenciais
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users?.users?.find(u => u.email === email);
      if (existing) {
        userId = existing.id;
        await supabase.auth.admin.updateUserById(userId, {
          password,
          user_metadata: { active: true, repurchased_at: new Date().toISOString() }
        });
        console.log(`Usuário existente atualizado: ${email}`);
      }
    } else {
      console.error('Erro ao criar usuário:', createErr);
      return { statusCode: 500, body: createErr.message };
    }
  } else {
    userId = created.user?.id;
    console.log(`Novo usuário criado: ${email} (id: ${userId})`);
  }

  // ── Envio de e-mail via Resend ────────────────────────────────
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY não configurada — e-mail não enviado');
    return { statusCode: 200, body: 'User created, email skipped (no API key)' };
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'ELITE Atacado Brasil <noreply@eliteatakadobrasil.com.br>',
      to: [email],
      subject: 'Seu acesso à ELITE Atacado Brasil está pronto!',
      html: buildEmail(name, email, password, platformUrl),
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error('Erro ao enviar e-mail:', errText);
    // Não retorna erro — usuário já foi criado no Supabase
  } else {
    console.log(`E-mail enviado para: ${email}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, email, userId }),
  };
};
