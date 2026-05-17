# Bot WhatsApp IA — Elite Atacado Brasil
## Guia Completo de Configuração

---

## Visão Geral do Sistema

```
Cliente manda mensagem
        ↓
Meta WhatsApp Cloud API (gratuita)
        ↓
N8N (Oracle Cloud — gratuito)
        ↓
Groq API / LLaMA 3.3 (gratuita)
        ↓
Supabase (gratuito — já configurado)
        ↓
Resposta automática para o cliente
```

**Custo total: R$ 0,00/mês** para até ~300 conversas por dia.

---

## Arquivos do Projeto

```
whatsapp-bot/
├── README.md                      ← Este guia
├── docker-compose.yml             ← Instala o N8N na VM Oracle
├── .env.example                   ← Template das variáveis (copie para .env)
├── supabase/
│   └── schema.sql                 ← Executa no Supabase para criar tabelas
├── n8n/
│   ├── workflow-verificacao.json  ← Importar no N8N (passo 4a)
│   ├── workflow-bot.json          ← Importar no N8N (passo 4b) — bot principal
│   └── workflow-followup.json     ← Importar no N8N (passo 4c) — recupera leads
└── prompts/
    └── system-prompt.txt          ← Personalidade e contexto do bot (referência)
```

---

## ETAPA 1 — Supabase (5 minutos)

Você já tem uma conta Supabase. Só precisa criar as tabelas do bot.

1. Acesse **supabase.com** → seu projeto
2. Clique em **SQL Editor** → **New Query**
3. Cole o conteúdo de `supabase/schema.sql`
4. Clique em **Run**

✅ Pronto! Tabelas `wpp_leads` e `wpp_conversas` criadas.

---

## ETAPA 2 — Groq API (5 minutos)

1. Acesse **console.groq.com**
2. Crie uma conta (sem cartão de crédito)
3. Vá em **API Keys** → **Create API Key**
4. Copie a chave (começa com `gsk_...`)
5. Guarde — você vai colocar no `.env`

---

## ETAPA 3 — Oracle Cloud — Instalar N8N (60 minutos)

### 3a. Criar VM gratuita no Oracle Cloud

1. Acesse **cloud.oracle.com** → crie conta (precisa de cartão, mas NÃO cobra)
2. No menu, vá em **Compute** → **Instances** → **Create Instance**
3. Configurações:
   - Nome: `elite-n8n`
   - Image: **Ubuntu 22.04**
   - Shape: **VM.Standard.E2.1.Micro** (Always Free — GRÁTIS)
   - **Gerar e baixar o par de chaves SSH** (guarde o arquivo .key)
4. Clique em **Create**
5. Após criar, copie o **IP Público** da instância

### 3b. Abrir portas no firewall Oracle

1. Na instância, clique em **Subnet** → **Default Security List**
2. Adicione regra de entrada:
   - Protocol: TCP
   - Destination Port: **5678** (N8N)
   - Source: 0.0.0.0/0
3. Também na VM (via SSH): execute os comandos abaixo

### 3c. Conectar e instalar N8N

Abra o terminal e conecte via SSH:
```bash
ssh -i seu-arquivo.key ubuntu@SEU_IP_ORACLE
```

Dentro da VM, execute:
```bash
# Instalar Docker
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker ubuntu
newgrp docker

# Criar pasta do projeto
mkdir ~/elite-n8n && cd ~/elite-n8n

# Baixar os arquivos do projeto (copie do GitHub)
# OU crie os arquivos manualmente com os conteúdos fornecidos

# Abrir porta no firewall da VM
sudo ufw allow 5678

# Iniciar N8N
docker compose up -d
```

4. Acesse: `http://SEU_IP_ORACLE:5678`
5. Crie seu usuário e senha na primeira vez

---

## ETAPA 4 — Meta WhatsApp Cloud API (30 minutos)

### 4a. Criar App no Meta

1. Acesse **developers.facebook.com**
2. **My Apps** → **Create App** → tipo **Business**
3. Nome do App: `Elite Atacado Bot`
4. Adicionar produto: **WhatsApp** → **Set Up**

### 4b. Configurar número de telefone

1. Em **WhatsApp** → **API Setup**
2. Clique em **Add Phone Number**
3. Adicione seu número de WhatsApp Business
4. Verifique por SMS ou ligação
5. Copie o **Phone Number ID** e o **Access Token temporário**

> ⚠️ O Access Token temporário expira em 24h. Para produção, gere um token permanente em:
> Business Settings → System Users → Add → Role: Admin → Generate Token

### 4c. Configurar Webhook

1. Em **WhatsApp** → **Configuration** → **Webhook** → **Edit**
2. **Callback URL**: `https://SEU_IP_ORACLE:5678/webhook/whatsapp-elite`
3. **Verify Token**: o valor que você definiu em `META_VERIFY_TOKEN` no `.env`
4. **Subscribe**: marque `messages`
5. Clique em **Verify and Save**

> O workflow de verificação precisa estar ativo no N8N antes deste passo!

---

## ETAPA 5 — Importar Workflows no N8N (15 minutos)

1. Acesse o N8N: `http://SEU_IP_ORACLE:5678`
2. No menu lateral: **Workflows** → **Import from File**

**Importe nesta ordem:**

### 5a. Workflow de Verificação
- Arquivo: `n8n/workflow-verificacao.json`
- Após importar: clique **Active** (toggle no topo direito)

### 5b. Workflow Bot Principal
- Arquivo: `n8n/workflow-bot.json`
- Após importar: clique **Active**

### 5c. Workflow Follow-up (DEIXE INATIVO INICIALMENTE)
- Arquivo: `n8n/workflow-followup.json`
- Ative apenas após testar o bot principal

---

## ETAPA 6 — Configurar Variáveis de Ambiente

1. Copie `.env.example` para `.env`
2. Preencha todos os valores:

```env
N8N_HOST=SEU_IP_ORACLE
N8N_USER=admin
N8N_PASSWORD=SUA_SENHA_FORTE

META_ACCESS_TOKEN=EAAxxxxxx        # Do painel Meta Developers
META_PHONE_NUMBER_ID=123456789     # Do painel Meta Developers
META_VERIFY_TOKEN=elite-token-2025 # Você que inventa

GROQ_API_KEY=gsk_xxxxxx            # Do console.groq.com

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...   # Settings > API > service_role key

HOTMART_LINK=https://pay.hotmart.com/XXXXXXX
```

3. Reinicie o N8N:
```bash
cd ~/elite-n8n
docker compose down && docker compose up -d
```

---

## ETAPA 7 — Teste Final

1. Mande uma mensagem para o seu número de WhatsApp Business
2. No N8N, vá em **Executions** para ver o workflow rodando
3. A resposta deve chegar em 2-5 segundos

### Mensagens de teste:
- "Oi, quero saber mais sobre a plataforma"
- "Qual o preço?"
- "O que vem incluso?"
- "Já comprei, como acesso?"

---

## Fluxo Completo do Bot

```
CLIENTE: "Oi, quanto custa?"
    ↓
Bot verifica histórico de conversas anteriores
    ↓
Groq IA gera resposta contextualizada
    ↓
BOT: "Olá! A Elite Atacado Brasil custa R$ 97,37
     — pagamento único, sem mensalidade 🎯
     Você tem acesso a 165 fornecedores verificados,
     treinamentos e ferramentas.
     Compra aqui: https://pay.hotmart.com/..."
    ↓
Conversa salva no Supabase
Lead registrado com status "interessado"
    ↓
(3 horas depois, se não comprou)
Follow-up automático enviado
```

---

## Monitoramento

Acesse o **Supabase** → **Table Editor**:
- `wpp_leads` — todos os leads e status
- `wpp_conversas` — histórico completo de conversas

---

## Custos Reais

| Serviço | Plano Gratuito | Custo |
|---------|---------------|-------|
| Oracle Cloud VM | Always Free (2 VMs) | R$ 0 |
| N8N | Self-hosted | R$ 0 |
| Groq API | 1.000 req/dia | R$ 0 |
| Meta WhatsApp API | Inbound gratuito | R$ 0 |
| Supabase | Já configurado | R$ 0 |
| **Follow-up proativo** | Templates pagos | ~R$ 0,08/msg |

---

## Suporte

Se o bot não responder, verifique:
1. N8N está rodando? `docker compose ps`
2. Workflow está ativo? (toggle verde no N8N)
3. Logs de erro: N8N → Executions → ver erros
4. Webhook está registrado? Meta Developers → WhatsApp → Configuration
