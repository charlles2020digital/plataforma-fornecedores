# 🌐 02 · Como Publicar Online

Passo a passo para colocar a plataforma no ar com URL pública.

---

## ⚡ Método mais rápido: Vercel (5-10 minutos)

### Passo 1 — Criar conta Vercel

1. Acesse: https://vercel.com/signup
2. Clique em "Continue with Google" (mais fácil)
3. Autorize o acesso

### Passo 2 — Preparar o arquivo

A Vercel espera que o arquivo principal se chame `index.html`. Faça uma cópia:

**No Windows:**
- Clique direito em `plataforma.html` → Copiar
- Cole na mesma pasta
- Renomeie a cópia para `index.html`

**No Mac/Linux:**
```bash
cp plataforma.html index.html
```

### Passo 3 — Fazer o deploy

1. No painel da Vercel, clique em **"Add New..."** → **"Project"**
2. Selecione **"Deploy without Git"** (ou conecte com GitHub se preferir)
3. Arraste a pasta `elite-atacado-brasil` inteira
4. Configure:
   - **Project Name:** `elite-atacado` (ou outro nome curto)
   - **Framework Preset:** Other / Static
   - **Build Command:** deixe em branco
   - **Output Directory:** deixe em branco
5. Clique em **"Deploy"** e espere 30 segundos

### Passo 4 — Acessar e testar

A Vercel vai te dar uma URL tipo `https://elite-atacado.vercel.app`.

**Pronto! A plataforma está no ar.**

---

## 🌎 Adicionar domínio próprio

Para parecer profissional, troque a URL `.vercel.app` por um domínio seu.

### Onde comprar (do mais barato pro mais caro)

| Registrador | Preço (.com.br) | Preço (.com) |
|---|---|---|
| **registro.br** | R$ 40/ano | — |
| **GoDaddy** | R$ 50/ano | R$ 60/ano |
| **Namecheap** | — | US$ 12/ano |
| **Hostinger** | R$ 30/ano | R$ 35/ano |

**Recomendação:** `registro.br` se quiser `.com.br` (estranho confiável e barato).

### Sugestões de domínio

- `eliteatacado.com.br`
- `eliteatacadobrasil.com.br`
- `atacadoelite.com.br`
- `elitefornecedores.com.br`
- `acessoelite.com.br`

### Conectar domínio à Vercel

1. No painel Vercel do projeto: **Settings** → **Domains**
2. Clique em **Add** e digite `seudominio.com.br`
3. Vercel mostra 2-3 registros DNS para configurar
4. No painel do registro.br: vá em "DNS" do seu domínio
5. Adicione os registros que a Vercel forneceu (geralmente um `A` e um `CNAME`)
6. Salve e aguarde 1-24h

Depois, sua plataforma estará em `https://seudominio.com.br` com HTTPS automático.

---

## 🆓 Alternativas (também grátis)

### Netlify (mais simples ainda)
1. Acesse https://netlify.com
2. Faça login com Google
3. **Arraste a pasta** direto na home (literalmente)
4. Aguarde 30s. Pronto.

### Cloudflare Pages
1. Acesse pages.cloudflare.com
2. Conecte com GitHub (precisa subir o projeto antes)
3. Deploy automático

### GitHub Pages
1. Crie repositório público chamado `elite-atacado-brasil`
2. Suba todos os arquivos
3. Settings → Pages → Source: `main`, pasta `/`
4. URL: `https://seuusuario.github.io/elite-atacado-brasil/`

---

## 🔒 HTTPS e segurança

**Vercel, Netlify e Cloudflare** dão HTTPS automático. Você não precisa fazer
nada — quando acessar `https://seudominio.com.br` vai funcionar com cadeado verde.

---

## 📊 Adicionar Google Analytics (opcional)

Para saber quantas pessoas visitam:

1. Crie conta em https://analytics.google.com
2. Adicione propriedade "Web" para seu domínio
3. Copie o snippet (algo como `<script>...gtag('config', 'G-XXXXX')...</script>`)
4. Abra `plataforma.html` e cole esse snippet dentro do `<head>` (linha 7-8)
5. Salve e refaça o deploy na Vercel

---

## ⚠️ Limitações da versão atual

A plataforma é uma **single-page application** em arquivo único:

✅ **Vantagens:**
- Abre rápido
- Funciona offline após primeira carga
- Fácil de hospedar
- Zero custo

❌ **Limitações:**
- "Logins" são demonstrativos (qualquer 6 dígitos funciona)
- Sem banco de dados real
- Favoritos somem ao limpar cache do navegador
- Painel admin é mockup

Para resolver isso, veja `03-CHECKOUT-E-CODIGOS.md`.
