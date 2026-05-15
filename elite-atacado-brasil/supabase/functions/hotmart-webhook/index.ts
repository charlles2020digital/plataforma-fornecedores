// ═══════════════════════════════════════════════════════════
// ELITE Atacado Brasil — Webhook Hotmart
// Supabase Edge Function
//
// Fluxo:
//   1. Hotmart confirma venda (PURCHASE_APPROVED)
//   2. Esta função recebe o webhook
//   3. Valida o hottok (segurança)
//   4. Cria o usuário no Supabase Auth
//   5. Envia convite por email (usuário define a própria senha)
// ═══════════════════════════════════════════════════════════

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Variáveis de ambiente (configuradas no painel do Supabase)
const HOTMART_HOTTOK        = Deno.env.get('HOTMART_HOTTOK') ?? ''
const SUPABASE_URL          = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// ─── Resposta padrão ──────────────────────────────────────
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

// ─── Handler principal ───────────────────────────────────
serve(async (req) => {
  // Apenas POST
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  // ── 1. Validar hottok (garante que veio da Hotmart) ──
  if (!HOTMART_HOTTOK || body['hottok'] !== HOTMART_HOTTOK) {
    console.error('hottok inválido')
    return json({ error: 'Unauthorized' }, 401)
  }

  // ── 2. Processar apenas compras aprovadas ────────────
  const event = body['event'] as string
  if (event !== 'PURCHASE_APPROVED') {
    console.log(`Evento ignorado: ${event}`)
    return json({ message: `Evento ${event} ignorado` })
  }

  // ── 3. Extrair dados do comprador ────────────────────
  const data   = body['data']   as Record<string, unknown>
  const buyer  = data?.['buyer'] as Record<string, unknown>
  const email  = buyer?.['email'] as string
  const name   = buyer?.['name']  as string

  if (!email) {
    console.error('Email do comprador não encontrado no webhook')
    return json({ error: 'Email não encontrado' }, 400)
  }

  console.log(`Nova compra aprovada — comprador: ${name} <${email}>`)

  // ── 4. Criar cliente Supabase com service role ───────
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // ── 5. Verificar se usuário já existe ────────────────
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const jaExiste = users.some(u => u.email === email)

  if (jaExiste) {
    console.log(`Usuário ${email} já possui acesso — ignorando criação`)
    return json({ message: 'Acesso já existente', email })
  }

  // ── 6. Enviar convite (usuário define a própria senha) ─
  //    O Supabase envia um email com link de acesso seguro.
  //    O usuário clica, define a senha e já entra na plataforma.
  const { data: invite, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name },
    redirectTo: `${Deno.env.get('PLATFORM_URL') ?? 'https://seudominio.com.br'}/plataforma.html`,
  })

  if (inviteError) {
    console.error('Erro ao criar convite:', inviteError.message)
    return json({ error: inviteError.message }, 500)
  }

  // ── 7. Garantir perfil como membro ───────────────────
  //    O trigger handle_new_user já cria o perfil,
  //    mas fazemos upsert como segurança extra.
  await supabase.from('profiles').upsert({
    id:         invite.user.id,
    full_name:  name ?? '',
    role:       'member',
    active:     true,
  })

  console.log(`✓ Acesso criado e convite enviado para ${email}`)
  return json({ success: true, email, userId: invite.user.id })
})
