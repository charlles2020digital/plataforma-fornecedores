# 💳 03 · Configurar Checkout e Códigos de Acesso

Como aceitar pagamentos e liberar acesso à plataforma automaticamente.

---

## 🎯 Comparativo das plataformas

Pesquisa atualizada das principais opções para produto digital de R$ 37,18:

| Plataforma | Taxa percentual | Taxa fixa | Em R$ 37,18 você recebe |
|---|---|---|---|
| **Cakto** | 0% (Pix) / 2,99% (cartão) | sem fixa | **R$ 36,06** (Pix) |
| **Hotmart** | 9,9% | R$ 1,00 | R$ 32,50 |
| **Kiwify** | 8,99% | R$ 2,49 | R$ 31,20 |
| **Eduzz** | 4,9% | R$ 1,00 | R$ 34,36 |

### 🏆 Recomendação: Cakto

**Por quê para o SEU caso (R$ 37,18, baixo ticket):**

1. **Pix sem taxa** — no Brasil, 70%+ das vendas online de baixo ticket são Pix
2. **Mais R$ 3-5 por venda** vs Hotmart/Kiwify
3. **Sem mensalidade**
4. **Fácil de configurar** (15-30 min)
5. **Saque rápido** (D+1 para Pix)

⚠️ Se você priorizar **marketplace de afiliados** ou **ecossistema maduro**,
escolha Hotmart. Para começar focado em ROI, Cakto é melhor.

---

## 🚀 Configurar Cakto (passo a passo)

### Passo 1 — Criar conta

1. Acesse https://cakto.com.br
2. Clique em "Criar conta grátis"
3. Cadastre-se com email + WhatsApp
4. Verifique seu email
5. Complete os dados bancários (Pix + dados de saque)

### Passo 2 — Cadastrar o produto

1. Vá em **"Meus Produtos"** → **"+ Novo Produto"**
2. Preencha:
   - **Nome:** "ELITE Atacado Brasil"
   - **Descrição:** "Plataforma de fornecedores verificados por atacado"
   - **Preço:** R$ 37,18
   - **Tipo:** Produto digital
   - **Categoria:** E-commerce / Empreendedorismo
3. Faça upload de:
   - **Imagem do produto** (use o logo da Elite ou screenshot da plataforma)
   - **Vídeo de apresentação** (opcional, mas aumenta conversão)

### Passo 3 — Configurar entrega automática

1. Na aba "Entrega do produto" → escolha **"E-mail automático"**
2. Configure o email que será enviado após a compra:

**Assunto:**
```
🎉 Seu acesso ELITE Atacado Brasil chegou!
```

**Corpo:**
```
Olá {{nome}},

Bem-vindo(a) à plataforma ELITE Atacado Brasil!

Aqui está seu acesso:

🔗 Link da plataforma: https://eliteatacado.com.br
🔑 Seu código de acesso: {{codigo_acesso}}

Como acessar:
1. Clique no link acima
2. Clique em "Acessar" no canto superior direito
3. Informe seu email ({{email}}) e WhatsApp ({{whatsapp}})
4. Digite o código de acesso

Qualquer dúvida, responda este email.

Bons negócios!
Equipe ELITE
```

### Passo 4 — Pegar o link de checkout

Após salvar o produto, a Cakto gera um link como:
```
https://pay.cakto.com.br/elite-atacado
```

### Passo 5 — Conectar ao site

Abra `plataforma.html` e procure pelo botão "Acessar agora" (CTA final).
Substitua a função `go` por:

```javascript
const go = () => {
  window.open('https://pay.cakto.com.br/SEU-LINK', '_blank');
};
```

Ou se preferir manter o login local de demonstração e só **conectar o botão
de venda final**, deixe os outros "Acessar" levarem ao login normal e só
o CTA principal levar pro checkout.

---

## 🔑 Sistema de Códigos de Acesso

Você tem 3 opções, do mais simples ao mais robusto:

### Opção A: Código fixo único (mais simples)

**Como funciona:**
- Você define um código fixo (ex: `ELITE2026`)
- Todos os clientes que pagarem recebem esse mesmo código
- Você troca o código mensalmente

**Vantagens:**
- Zero programação
- Funciona em 5 minutos

**Desvantagens:**
- Pessoas vão compartilhar o código
- Você perde vendas

**Como implementar:**
Edite `plataforma.html`, procure pela função `verify` e adicione:

```javascript
const verify = e => {
  e.preventDefault();
  setErr('');
  const validCodes = ['ELITE2026', '999999']; // adicione códigos válidos aqui
  if (validCodes.includes(code)) {
    onLogin(code === '999999' ? 'admin' : 'member');
  } else {
    setErr('Código inválido. Tente novamente.');
  }
};
```

### Opção B: Lista manual de códigos (intermediária)

**Como funciona:**
- Você gera 100-500 códigos aleatórios manualmente
- A cada venda, você envia 1 código personalizado pelo email da Cakto
- Cada código só funciona uma vez (você precisa rastrear)

**Vantagens:**
- Códigos únicos por cliente
- Sem programação extra

**Desvantagens:**
- Operação manual
- Difícil escalar acima de 30 vendas/dia

**Como implementar:**
1. Gere 500 códigos aleatórios em https://passwordsgenerator.net
2. Salve numa planilha Excel
3. Configure o email da Cakto pra incluir uma variável `{{codigo_personalizado}}`
4. A cada venda, vá na planilha, marque o código como "usado" e cole na resposta
5. Na plataforma, adicione esses 500 códigos como válidos no código

### Opção C: Webhook + Banco de Dados (escalável)

**Como funciona:**
- A Cakto avisa um servidor seu (webhook) quando alguém compra
- Servidor gera código único automaticamente
- Envia código por email/WhatsApp
- Plataforma valida códigos contra banco de dados (Supabase)

**Vantagens:**
- 100% automatizado
- Escala infinitamente
- Códigos únicos e rastreáveis

**Desvantagens:**
- Requer programação
- Custos: Supabase grátis até 50k usuários, depois ~$25/mês

**Stack recomendada:**
- **Backend:** Vercel Functions (grátis até 100GB-h/mês)
- **Banco:** Supabase (grátis)
- **Email:** Resend (grátis até 3000 emails/mês)
- **Tempo de implementação:** 4-8 horas com ajuda de IA

---

## 📊 Quando migrar de uma opção pra outra

| Volume de vendas | Use |
|---|---|
| 0-10 vendas/mês | Opção A (código fixo) |
| 10-100 vendas/mês | Opção B (lista manual) |
| 100+ vendas/mês | Opção C (webhook automatizado) |

**Comece com a A. Não otimize antes de ter problemas.**

---

## 🧪 Como testar o checkout antes de divulgar

1. **Teste 1:** Compre seu próprio produto com Pix de R$ 0,01 (Cakto permite preço de teste)
2. **Teste 2:** Verifique se o email automático chegou
3. **Teste 3:** Use o código no login da plataforma
4. **Teste 4:** Confirme que entra na área de membros
5. **Teste 5:** Baixe os 6 materiais e verifique que abrem corretamente

⚠️ **Não divulgue até testar TODOS esses 5 passos.**
