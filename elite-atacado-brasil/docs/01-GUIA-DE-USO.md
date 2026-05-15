# 📖 01 · Guia de Uso da Plataforma

Como navegar e entender cada tela do produto.

---

## 🏠 Tela 1: Landing Page (página de venda)

A primeira tela que o cliente vê ao clicar no anúncio do Instagram.

### Estrutura visual

1. **Header fixo** com logo e botão "Acessar" dourado destacado
2. **Hero cinematográfico** com:
   - Imagem de fundo de loja atacadista
   - Mockup do dashboard flutuando (animação `float`)
   - Avatares de revendedoras + nota 5⭐
   - 2 CTAs (Acessar diretório + Ver demonstração)
3. **Logo bar** com marcas em carrossel infinito (Pit Bull, Sawary, Aramis...)
4. **Stats animados** (165 fornecedores, 11 subcategorias, 5K+ membros, 24/7)
5. **Bento grid** apresentando as 4 áreas (Diretório, Treinamentos, Ferramentas, Comunidade)
6. **Galeria dos polos atacadistas** (Brás, Rua 44, Moda Center, Nova Serrana, 25 de Março)
7. **"Para quem é"** com cards separados:
   - Revendedora autônoma (sem CNPJ)
   - Lojista com CNPJ
8. **Depoimentos** com 3 testemunhos + avatares + 5⭐
9. **FAQ** com 5 perguntas mais comuns
10. **CTA final** com preço (R$ 197 riscado → R$ 37,18) + garantia 7 dias
11. **Footer** com logo e copyright

---

## 🔐 Tela 2: Login

Tela de acesso em **dois passos** (Pix em duas etapas).

**Passo 1:** Email + WhatsApp da compra
**Passo 2:** Código de 6 dígitos

### Acessos de demonstração

| Código | Tipo | Acesso |
|---|---|---|
| `999999` | Admin | Vê painel administrativo extra |
| Qualquer outro 6 dígitos | Membro | Acesso normal à plataforma |

⚠️ Em produção, esses códigos serão substituídos pelos códigos reais gerados
pelo webhook do checkout. Veja `03-CHECKOUT-E-CODIGOS.md`.

---

## 📂 Tela 3: Dashboard (área interna)

Após o login, o usuário entra na área principal com 3 abas (4 se for admin):

### Aba 1: Fornecedores

- **Sidebar lateral** (desktop) ou **bottom nav** (mobile)
- **Filtros por categoria:** Feminino, Masculino, Infantil, Beleza
- **Filtros por subcategoria:** botões horizontais no topo (11 subcategorias)
- **Busca** por nome, cidade ou nicho
- **Cards de fornecedores** com:
  - Foto contextualizada (rotação inteligente)
  - Badge "Verificado" (todos têm)
  - Badge "Fábrica" (quando é fabricante direto)
  - Botão de favoritar (estrela dourada)
  - Botão WhatsApp (verde) com **mensagem pré-preenchida**
  - Botão Instagram (escuro) com fallback

### Lógica inteligente dos botões

| Cenário | Botão WhatsApp | Botão Instagram |
|---|---|---|
| Tem WhatsApp + Instagram | Abre conversa direta | Abre perfil no IG |
| Só tem WhatsApp | Abre conversa direta | Avisa e redireciona pro WA |
| Só tem Instagram | Avisa e redireciona pro IG | Abre perfil no IG |

### Aba 2: Treinamentos

- **6 aulas** em cards com thumbnail
- Clique abre modal com player de vídeo (placeholder)
- Em produção, integrar com Vimeo/YouTube privado

### Aba 3: Ferramentas

- **6 materiais baixáveis:**
  - 4 PDFs (Guia, Manual, Scripts, Transportadoras)
  - 2 Planilhas Excel (Calculadora, Estoque)
- Botão "Baixar PDF" / "Baixar Planilha"
- Download instantâneo (arquivos embutidos em base64)

### Aba 4: Admin (apenas para role=admin)

- **3 métricas principais:** membros ativos, faturamento, conversão
- **Atividades recentes** (lista mock)
- **Fornecedores cadastrados** (preview da lista)
- **Botão "Adicionar fornecedor"** (placeholder)

---

## 📱 Comportamento responsivo

| Tela | Comportamento |
|---|---|
| Mobile (< 768px) | Sidebar vira bottom navigation, hero sem mockup |
| Tablet (768-1024px) | Sidebar lateral aparece, grid 2 colunas |
| Desktop (1024px+) | Layout completo, mockup flutuante, grid 3 colunas |

---

## 🎨 Identidade visual "Elite Premium"

| Cor | Hex | Uso |
|---|---|---|
| Preto profundo | `#0a0a0a` | Fundo principal |
| Cinza escuro | `#141414` | Cards e seções |
| Borda sutil | `#2a2a2a` | Bordas |
| Dourado | `#d4af37` | CTAs, destaques |
| Branco texto | `#fafafa` | Texto principal |
| Cinza texto | `#a1a1aa` | Texto secundário |
| Verde WhatsApp | `#25D366` | Botão WhatsApp |

**Tipografia:** System UI (sans-serif nativa) + Georgia italic em depoimentos.

---

## 🛠️ Editar a plataforma

A plataforma é **um único arquivo HTML** editável em qualquer editor.

### O que você pode editar facilmente

| O que | Como |
|---|---|
| Adicionar fornecedores | Procure `const SUPPLIERS=[` e adicione novos itens |
| Mudar texto da landing | Procure por strings em português e edite |
| Trocar imagens | Substitua URLs do Unsplash |
| Mudar preço | Procure `R$ 37,18` e altere em todos os locais |
| Adicionar materiais | Veja seção avançada |

### O que NÃO editar sem entender

- Funções `useAuth`, `Modal`, `downloadFile`
- Estruturas React (JSX entre `<>` `</>`)
- Os dados base64 dos PDFs/XLSXs (linhas longas com `JVBE...` ou `UEsD...`)
