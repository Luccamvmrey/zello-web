# Zello — Guidelines de UI (apps/web)

> **Este documento é a linguagem de design: como o painel deve parecer e por quê.**
> As regras que *não podem* ser quebradas, quem as verifica e o que fazer para desviar estão em
> [`DESIGN-CONTRACT.md`](./DESIGN-CONTRACT.md). Vá lá antes de abrir um PR.
>
> Base: auditoria visual de todas as rotas do painel em 2026-09-15 (Chrome DevTools, 1440×900 e 390×844).
> Escopo: `apps/web`. A landing (`apps/landing`) compartilha a paleta via `@repo/ui/styles/theme.css` mas tem
> linguagem própria (marketing) — o que está aqui não a governa.

---

## 1. Princípio de produto

O Zello divide dinheiro na hora da venda. A UI precisa transmitir **precisão contábil**, não
entusiasmo de startup. A direção correta é a de um **livro-razão bem impresso**: papel, tinta,
régua, algarismos alinhados. Isso já está nos tokens (fundo `#f0f2ee` papel, verde-tinta
`#2f5233`, dourado `#b08d3e`, `font-variant-numeric: tabular-nums`) — o problema é que a
implementação atual **não usa** essa direção, e o resultado lê como wireframe.

Três regras que decorrem disso:

1. **Número é protagonista.** Valores e contagens são o conteúdo; rótulo é legenda.
2. **Separação por régua, não por sombra.** Hierarquia vem de linha, peso e espaço — não de
   drop-shadow e gradiente.
3. **Nada de decoração vazia.** Se um elemento não carrega informação, ele não entra.

---

## 2. Diagnóstico — o que está errado hoje

### 2.1 Bloqueadores

| # | Problema | Onde | Evidência |
|---|---|---|---|
| B1 | **Painel não é responsivo.** Sidebar `w-60` fixa, sem drawer nem breakpoint. Em 390px sobra ~150px de conteúdo e a página ganha scroll horizontal. | `layouts/authenticated-layout.tsx`, `components/app-sidebar.tsx` | screenshot 390×844 do `/dashboard` |
| B2 | **Cards são invisíveis.** `--card` (`#f0f2ee`) é **idêntico** a `--background`, e o ring `foreground/10` dá contraste de **1.27:1** contra o fundo. Os 4 widgets do dashboard não se lêem como superfícies. | `packages/ui/src/styles/theme.css:14`, `components/ui/card.tsx:14` | contraste medido |
| B3 | **Item ativo da sidebar mal se distingue.** `--sidebar-accent` (`#2c3f31`) contra `--sidebar` (`#1b2b22`) = **1.32:1**. A navegação não comunica onde você está. | `index.css:72`, `app-sidebar.tsx:45` | contraste medido |
| B4 | **Estado de erro usa vermelho genérico do shadcn** (`oklch(0.577 0.245 27.325)`), fora da paleta. Além disso o label inteiro fica vermelho, sem ícone e sem resumo — o onboarding vazio vira uma parede de vermelho saturado. | `index.css:58`, form fields | screenshot `/onboarding` pós-submit |

### 2.2 Estrutura e hierarquia

- **`/settings` e `/onboarding` são um scroll único de 13 campos**, sem agrupamento. "CNPJ",
  "Razão Social", "CEP", "Faturamento mensal" e "Número de PDVs" são quatro assuntos diferentes
  empilhados sem respiro. Falta seccionamento (Identificação / Endereço / Operação).
- **Sem feedback de progresso no onboarding.** É a primeira tela real do produto e não diz quanto
  falta nem por que esses dados são pedidos.
- **Dashboard morto.** Quatro contadores em zero e 600px de vazio abaixo. Não há estado de
  "conta nova" que oriente o próximo passo.
- **`PageHeader` não tem régua.** Título e conteúdo flutuam sem separação; a página não tem "topo".
- **Placeholders idênticos** para Regras/Catálogo/Terminais/Vendas ("Em construção") — 4 das 7
  rotas do menu não entregam nada, e a caixa tracejada reforça a sensação de protótipo.

### 2.3 Componentes

- **Dialog sem estrutura.** `Novo colaborador` não tem separador header/body/footer, não tem botão
  de cancelar, e o CTA é full-width — trata um form curto como um wizard.
- **Botões primários full-width fora de contexto.** "Salvar alterações" e "Adicionar" ocupam a
  largura toda do form. Ação de formulário longo pertence a uma barra de rodapé alinhada à direita.
- **Sem estado de campo obrigatório.** No onboarding, CNPJ/Nome/Razão/Segmento são obrigatórios e
  CEP/Rua/Bairro/Cidade/Estado não — nada na UI indica isso antes do submit.
- **Inputs com larguras arbitrárias.** CEP é curto, Número é metade, Faturamento é 3/5 — sem uma
  escala declarada, cada campo é uma decisão avulsa.
- **Toggle "Mostrar inativos" solto** acima da tabela, sem barra de ferramentas que o contenha.
- **Tabela sem zebra, sem hover, sem densidade definida**, e com header de mesmo peso do corpo.

### 2.4 Cor e tipografia

- **O dourado `--highlight` não é usado em lugar nenhum** do painel além da marca na sidebar. A
  única cor de personalidade da paleta está inerte. (Atenção: `#b08d3e` sobre papel dá **2.77:1** —
  serve para acento gráfico grande, **nunca** para texto ou ícone pequeno.)
- **Uma única escala de peso.** Labels, headers de tabela e títulos de card usam tamanhos próximos
  demais; nada domina.
- **`.tabular` existe mas quase não é aplicado** — o dashboard aplica, a tabela de colaboradores não.
- **Zero tokens de elevação, espaçamento ou escala tipográfica.** Só existem cores e `--radius`.

### 2.5 Contrastes medidos (light)

| Par | Ratio | Veredito |
|---|---|---|
| `foreground` / `background` | 13.17 | ✅ |
| `muted-foreground` / `background` | 6.51 | ✅ |
| `primary` / `background` | 7.85 | ✅ |
| `primary-foreground` / `primary` | 7.85 | ✅ |
| `border` / `background` | **1.27** | ❌ borda praticamente invisível |
| `sidebar-accent` / `sidebar` | **1.32** | ❌ item ativo indistinto |
| `highlight` / `background` | **2.77** | ❌ inutilizável para texto |
| `sidebar-foreground/70` / `sidebar` | ~6.69 | ✅ |

---

## 3. Guidelines

### 3.1 Tokens — adições obrigatórias

Adicionar em `packages/ui/src/styles/theme.css` (fonte única da paleta):

```css
:root {
  /* Superfícies: card DEVE se distinguir do fundo. */
  --card: #f7f8f5;          /* papel mais claro que o fundo */
  --surface-sunken: #e7eae2; /* faixas, toolbars, zebra de tabela */

  /* Bordas em três forças, por papel. */
  --input: #7f8c79;         /* controles de formulário — 3.14:1, WCAG 1.4.11 */
  --border: #a3ad9c;        /* estrutural — divisórias, contorno de card */
  --border-subtle: #d5dacc; /* decorativo — separador interno, papel pautado */

  /* Semânticos na família da marca, não o vermelho default do shadcn. */
  --destructive: #8f2f28;
  --destructive-foreground: #f7f8f5;
  --success: #2f5233;
  --warning: #8a6a1f;       /* dourado escurecido até virar legível */

  /* Elevação — sutil, de livro, nunca material design. */
  --elevation-raised: 0 1px 2px oklch(0.25 0.03 150 / 0.06);
  --elevation-overlay: 0 8px 24px oklch(0.25 0.03 150 / 0.14);
}
```

**Por que três tokens de borda.** Só `--input` tem requisito normativo: a WCAG 1.4.11 exige 3:1
para o contorno de um controle de formulário contra o fundo adjacente. Contorno de card e
divisória de seção **não** são regidos por esse critério — ali o alvo é legibilidade, e forçar
3:1 deixaria a página pesada e riscada. Por isso `--border` fica em 2.07:1: acima do 1.27:1
original, abaixo do peso de uma borda de input.

Um card não é identificado pela diferença de superfície (`--card` vs `--background` é só 1.06:1,
e deve ser sutil mesmo — é papel sobre papel). Quem faz o card existir é a combinação
**superfície + borda + `--elevation-raised`**. Nenhum dos três sozinho basta.

E na sidebar (`apps/web/src/index.css`): subir `--sidebar-accent` para **`#4e6c55`** (2.54:1
contra `--sidebar`) e marcar o item ativo também com uma **barra dourada de 2px à esquerda**,
para que o estado sobreviva a monitores ruins.

**Regra:** nenhum hex literal em componente. Tudo passa por token.

### 3.2 Escala tipográfica

| Uso | Classe | Peso |
|---|---|---|
| Título de página (h1) | `text-2xl tracking-tight` | 600 |
| Título de seção / card | `text-base` | 500 |
| Corpo / input | `text-sm` | 400 |
| Label de campo | `text-sm` | 500 |
| Header de tabela | `text-xs uppercase tracking-wide` | 500, `text-muted-foreground` |
| Legenda / ajuda / erro | `text-xs` | 400 |
| Número de destaque | `text-3xl tabular` | 600 |

- **`.tabular` é obrigatório** em qualquer valor monetário, contagem, CPF/CNPJ, CEP, telefone,
  porcentagem e data. Sem exceção.
- Nunca mais de **três** níveis tipográficos visíveis na mesma tela.

### 3.3 Espaçamento e layout

- Escala: múltiplos de 4 — `2, 3, 4, 6, 8, 10, 12, 16`. Nada fora disso.
- Largura de conteúdo: `max-w-5xl` para listas/dashboard; **`max-w-2xl` para formulários**
  (a `/settings` hoje herda a largura larga e os campos ficam esticados demais).
- Ritmo vertical: `py-10` no container, `mt-8` entre header e conteúdo, `gap-6` entre seções de
  form, `gap-4` entre campos de uma mesma seção.
- **Grid de campos:** todo form usa `grid-cols-12`. Larguras permitidas: `col-span-12` (texto livre),
  `col-span-6` (par lado a lado), `col-span-4` (Cidade/Estado/Número), `col-span-3` (CEP, PDVs,
  percentuais). Sem larguras avulsas.

### 3.4 Página

Toda página autenticada segue:

```
PageHeader  (h1 + descrição + ação primária à direita)
──────────────────  ← régua de 1px, border-subtle
[ toolbar opcional: filtros, busca, toggles ]
conteúdo
```

- `PageHeader` ganha `border-b border-border-subtle pb-6`.
- A ação primária da página vive **no header, à direita** — nunca no fim do scroll.
- Descrição é obrigatória em toda página. Uma frase, minúscula, diz o que a página faz.

### 3.5 Formulários

- **Agrupe em seções** com título `text-base font-medium` + linha. `/settings` e `/onboarding`
  viram: **Identificação** (CNPJ, Nome Fantasia, Razão Social, Segmento) · **Endereço** (CEP → Rua,
  Número, Complemento, Bairro, Cidade, Estado) · **Operação** (Faturamento, Encargos, PDVs).
- **Campo obrigatório** leva `*` no label. Opcional leva `(opcional)` em `text-xs muted`. Escolha
  uma das duas convenções por form e não misture.
- **Ações ficam numa barra sticky de rodapé**, alinhadas à direita, com `border-t` e fundo
  `--card`: `[ Cancelar (ghost) ] [ Salvar (primary) ]`. Nunca full-width em desktop.
- **Erro:** borda `--destructive`, ícone `AlertCircle` de 14px + mensagem em `text-xs` abaixo do
  campo. **O label NÃO muda de cor.** Ao submeter com erros, dar `scrollIntoView` + `focus` no
  primeiro campo inválido.
- **Máscaras** (CNPJ, CPF, CEP, telefone) já existem em `apps/web/src/lib/utils.ts` — reusar
  `formatCnpj`/`formatCpf`/`formatPhone`, nunca reimplementar.
- CEP preenchido deve **autocompletar** Rua/Bairro/Cidade/Estado (ViaCEP) e mostrar os campos
  preenchidos como somente-leitura editável.

### 3.6 Dados

**Card de métrica:**
```
[ícone 16px]  Rótulo            ← text-sm, muted-foreground
1.482                            ← text-3xl font-semibold tabular
+12% vs. mês anterior            ← text-xs, delta com cor semântica
```
Card clicável leva `hover:border-border hover:shadow-raised` e `cursor-pointer`.

**Tabela:**
- Header `text-xs uppercase tracking-wide text-muted-foreground`, `border-b border-border`.
- Linhas com `hover:bg-surface-sunken`, altura mínima `h-12` (densidade confortável).
- Colunas numéricas/documentos: `text-right` + `.tabular`.
- Coluna "Ações" alinhada à direita, ícones revelados em `group-hover` (mas sempre focáveis via teclado).
- **Sempre** tem: estado de carregamento (skeleton com o número de linhas da página), estado vazio
  e estado de erro. Nunca uma tabela em branco sem explicação.

**Estado vazio** (`EmptyState`) tem três partes obrigatórias: ícone, uma frase do que falta, e um
CTA que resolve. O "Em construção" atual deve virar: ícone + "Regras de divisão chegam em breve" +
uma linha do que essa tela vai permitir fazer.

### 3.7 Componentes de interação

- **Botões:** `primary` (uma por tela), `outline` (secundária), `ghost` (terciária/ícone),
  `destructive` (só em confirmação de exclusão). Altura `h-9`, `rounded-md`.
- **Dialog:** header com título + descrição + `X`; corpo com `max-h-[70vh] overflow-y-auto`; footer
  com `border-t` e `[ Cancelar ] [ Confirmar ]` à direita. Largura `sm:max-w-lg`. Overlay
  `bg-foreground/40` (o atual está claro demais e o blur não compensa).
- **Toolbar de lista:** um contêiner `flex items-center gap-3` com `border-b`, contendo busca à
  esquerda e filtros/toggles à direita. O "Mostrar inativos" entra aí.
- **Foco:** `focus-visible:ring-2 ring-ring ring-offset-2`. Nunca `outline: none` sem substituto.
- **Transições:** só `colors`, `opacity` e `transform`, `duration-150`. Nada de animação de layout.
- **Toast** (`sonner`, já instalado) para toda mutação: sucesso e erro. Nenhuma ação de escrita
  pode acontecer em silêncio.

### 3.8 Responsivo

Breakpoints: `sm 640` · `md 768` · `lg 1024`.

- `< lg`: sidebar vira drawer (`Sheet`) com trigger num topbar de 56px que mostra a marca e o
  avatar. O layout atual precisa de `lg:flex` na `aside` e um header mobile.
- `< sm`: todos os grids de form colapsam para `col-span-12`; cards de métrica em 1 coluna;
  tabelas viram lista de cards (não scroll horizontal).
- Alvos de toque ≥ 44px em mobile.
- **Nenhuma página pode ter scroll horizontal em 390px.** Isso é critério de aceite.

### 3.9 Acessibilidade

- Contraste mínimo: **4.5:1** texto; **3:1** bordas de controle de formulário (`--input`), ícones
  informativos e estados. Borda decorativa e contorno de card não caem nessa regra — ver 3.1.
- `--highlight` (dourado) é proibido para texto sobre papel. Use `--warning` (`#8a6a1f`) quando
  precisar de dourado legível.
- Toda cor que comunica estado vem acompanhada de ícone ou texto.
- Todo input tem `<label>` associado; nunca placeholder como rótulo.
- Diálogos devolvem o foco ao elemento que os abriu.

### 3.10 Dark mode

Os tokens dark existem e nunca foram exercitados — **nenhuma tela foi validada em dark**. Antes de
prometer o tema: adicionar um toggle (a landing já tem um em `apps/landing/src/components/theme-toggle.tsx`,
reusar o padrão), e revisar `--card` dark (`#22342a` vs `--background` `#1b2b22` = separação fraca,
mesmo problema do light).

---

## 4. Prioridade de execução

**P0 — quebra o produto — ✅ entregue em 2026-09-15**
1. ~~Responsivo: drawer da sidebar + colapso de grids (B1).~~ `AppSidebar` agora é `hidden lg:flex`,
   com `AppMobileHeader` + `ui/sheet.tsx` abaixo de `lg`. Verificado em 390×844: sem overflow.
2. ~~`--card` distinto do fundo + `--border` estrutural (B2).~~ Card = superfície + borda + elevação.
3. ~~Contraste do item ativo da sidebar + barra dourada (B3).~~ 1.32:1 → 2.54:1 + barra `--highlight`.
4. ~~`--destructive` na paleta + padrão de erro sem label vermelho (B4).~~ Erro = borda + ícone +
   mensagem `text-xs`; `scrollToFirstError` leva o primeiro campo inválido à tela.

**P1 — parece inacabado — ✅ entregue em 2026-09-15**
5. ~~Seccionar `/settings` e `/onboarding`; barra de ações sticky; `max-w-2xl`.~~ Novos
   `components/form-section.tsx` e `components/form-actions.tsx`.
6. ~~`PageHeader` com régua; toolbar de lista; tabela com header/hover/tabular.~~ Novo
   `components/list-toolbar.tsx`.
7. ~~Estados vazios reais no lugar de "Em construção"; empty state do dashboard novo.~~
   `PlaceholderPage` exige um `upcoming`; dashboard de conta nova mostra "Primeiros passos".
8. ~~Dialog com footer estruturado e botão Cancelar.~~ Mais descrição e corpo rolável.

**P2 — acabamento — ✅ entregue em 2026-09-15**
9. ~~Dourado como acento.~~ Barra do item ativo, tique na régua do `PageHeader`, marca nas
   métricas com valor > 0. Não há dado de variação na API — nenhum delta foi inventado.
10. ~~`.tabular` em 100% dos números; escala tipográfica aplicada.~~
11. ~~Toasts em todas as mutações; skeletons consistentes.~~ O skeleton de `/settings` espelha
    as três seções do formulário em vez de três barras genéricas.
12. ~~Validar e ligar dark mode.~~ Script anti-flash no `index.html` e `ThemeToggle` na sidebar,
    com a mesma chave de storage da landing. Todas as telas verificadas nos dois temas.

**Aberto**
- Autocompletar endereço pelo CEP (ViaCEP), previsto em 3.5.
- Tabela vira lista de cards abaixo de `sm` (hoje rola no próprio container, o que é aceitável
  pelo 3.8 mas não é o alvo).
- `bug-031`: tela em branco em `/dashboard` logo após o login de um usuário sem estabelecimento.

---

## 5. Checklist de PR

Mudou-se para [`DESIGN-CONTRACT.md` §4](./DESIGN-CONTRACT.md), junto com o verificador
automático que cobre a parte mecânica (`pnpm lint`).
