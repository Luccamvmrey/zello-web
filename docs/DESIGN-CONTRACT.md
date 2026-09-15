# Zello — Contrato de Design

> **O que este documento é:** o conjunto mínimo de invariantes que a UI do painel não pode
> quebrar, quem verifica cada um, e o que fazer quando você precisa desviar.
>
> **O que ele não é:** a linguagem de design. Essa vive em [`UI-GUIDELINES.md`](./UI-GUIDELINES.md)
> e responde "como deve parecer". Este aqui responde **"como isso continua verdadeiro daqui a
> seis meses"**.

---

## 0. Por que existe

Um documento de regras não mantém regra nenhuma. O que mantém é: a regra ser **verificável**, a
verificação ser **automática**, e o desvio ser **caro o suficiente para ser deliberado**.

Isso não é teoria. Entre escrever as guidelines e escrever este contrato, **quatro violações
entraram no código** — duas delas minhas, nas mesmas horas em que eu implementava as regras:

| Violação | Onde | Como foi achada |
|---|---|---|
| Paleta inteira do Tailwind (verde, cinza, azul, amarelo) num badge | `status-badge.tsx` | grep manual, dias depois |
| Overlay `bg-black/10` sobrevivendo em dois componentes | `alert-dialog.tsx`, `select.tsx` | grep manual |
| `--warning` especificado em 4.48:1 num contrato que exige 4.5:1 | `theme.css` | medição manual |
| `ring-foreground/10` (1.27:1) sobrevivendo em popover e alert | `select.tsx`, `alert-dialog.tsx` | grep manual |

Todas passariam por revisão humana sem serem notadas. Nenhuma passa pelo `check:design` hoje.
**É essa a diferença entre um guia e um contrato.**

---

## 1. Fonte da verdade

Antes de mudar qualquer coisa, saiba qual arquivo manda. Editar o lugar errado é como a maioria
das regressões começa.

| Assunto | Fonte única | Nunca edite para isso |
|---|---|---|
| Paleta, superfícies, bordas, semânticos, elevação | `packages/ui/src/styles/theme.css` | o `index.css` de um app |
| Tokens da sidebar, charts, `--radius` | `apps/web/src/index.css` | o tema compartilhado |
| Registro dos tokens no Tailwind (`@theme inline`) | `apps/web/src/index.css` | — |
| Moldura de página | `components/page-header.tsx` | um `<h1>` na página |
| Agrupamento de campos | `components/form-section.tsx` | um `<div>` com título |
| Ações de formulário longo | `components/form-actions.tsx` | um `<Button>` solto no fim |
| Faixa de filtros de lista | `components/list-toolbar.tsx` | um `<div flex>` acima da tabela |
| Primitivos (Button, Input, Dialog, Table…) | `components/ui/*` via `pnpm dlx shadcn@latest add` | escrever à mão |

**A regra de ouro:** o tema compartilhado é importado também pela landing
(`apps/landing`). Mexeu nele, verifique a landing — nos dois temas. Já houve um caso: `--border`
era usado como textura decorativa no hero, e escurecê-lo teria mudado uma página que ninguém
pediu para mexer.

---

## 2. Os invariantes

Cada um tem um id, um verificador e um custo de desvio. Os que o `check:design` cobre são
**bloqueantes**: quebram o `pnpm lint`.

### Verificados por máquina

| id | Invariante | Verificador |
|---|---|---|
| **C1** | Nenhuma cor literal em `.ts/.tsx` — nem hex, nem paleta Tailwind, nem `black`/`white`. Cor vem de token. | `check:design` |
| **C2** | Contorno de controle de formulário usa `border-input`, nunca `border-border`. | `check:design` |
| **C3** | Página não declara `<h1>` próprio — passa pelo `PageHeader`. | `check:design` |
| **C4** | Sem `min-w-[>360px]` e sem `w-screen`. | `check:design` |
| **C5** | `outline-none` só acompanhado de um `focus-visible:` na mesma classe. | `check:design` |

```bash
pnpm --filter web check:design   # isolado
pnpm lint                        # roda junto do oxlint, em todo o monorepo
```

### Verificados por pessoa, no navegador

Estes **não** são checáveis a partir do código-fonte. Exigem renderizar. Constam do checklist de
PR (§4) e da auditoria periódica (§5).

| id | Invariante | Como verificar |
|---|---|---|
| **H1** | Nenhuma página rola horizontalmente em 390px. | `emulate 390x844x3,mobile,touch` + comparar `scrollWidth` e `clientWidth` |
| **H2** | Texto ≥ 4.5:1; contorno de controle, ícone informativo e estado ≥ 3:1. | medir, não estimar — ver §6 |
| **H3** | Toda tela funciona nos dois temas. | alternar pelo `ThemeToggle` na sidebar |
| **H4** | Toda lista tem os quatro estados: carregando, vazio, erro, populado. | exercitar os quatro |
| **H5** | Toda ação de escrita dá retorno visível (toast). | executar a mutação |
| **H6** | Navegação completa por teclado, com foco sempre visível. | Tab da primeira à última ação |

### O invariante que governa os outros

> **H0 — Nada que a tela afirma pode ser inventado.**
>
> Se a API não devolve o dado, a interface não mostra o dado. Sem variação percentual sem série
> histórica, sem gráfico de tendência com um ponto só, sem "economia estimada" sem os números
> que a produzem.
>
> Este é o único invariante sem verificador automático e o mais importante de todos: o Zello
> divide o dinheiro dos outros. Uma tela que inventa um número destrói mais confiança do que
> qualquer problema de contraste. Quando o dado não existe, a resposta certa é mostrar menos.

---

## 3. Desvio consciente

Regra rígida demais vira regra ignorada. O desvio é permitido, mas **registrado em dois lugares**:

1. No código, na linha ou no comentário imediatamente acima:
   ```tsx
   {/* design-contract-allow C3: tela pública, moldura do AuthLayout. A régua
       e o tique do PageHeader pertencem ao painel, não a um cartão centrado. */}
   <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
   ```
   O marcador sem justificativa é violação; quem revisa deve tratar assim.

2. No **Livro de exceções** (§7) deste documento.

Duas exceções pelo mesmo motivo significam que o invariante está errado, não o código.
Nesse caso **mude o invariante** e apague as duas — não acumule uma terceira.

---

## 4. Checklist de PR que toca a UI

Mecânico (o `pnpm lint` responde por C1–C5 — não repita à mão):

- [ ] `pnpm lint` e `pnpm typecheck` passam.
- [ ] Todo `design-contract-allow` novo tem justificativa e entrada no §7.

Visual (só você responde):

- [ ] H1 — 390px, sem scroll horizontal.
- [ ] H2 — contrastes medidos nos pares que você introduziu ou mexeu.
- [ ] H3 — conferido nos dois temas.
- [ ] H4 — os quatro estados da lista, se você mexeu numa lista.
- [ ] H5 — toast em toda escrita.
- [ ] H6 — Tab do começo ao fim.
- [ ] H0 — nenhum número na tela sem origem na API.

Sistema:

- [ ] Token novo entrou em `theme.css` **e** foi registrado no `@theme inline`.
- [ ] Mexeu no tema compartilhado? A landing foi verificada nos dois temas.
- [ ] Componente de moldura novo? Entrou na tabela do §1.

---

## 5. Auditoria periódica

O `check:design` pega deriva mecânica. Deriva **visual** — espaçamento que foi ficando
irregular, hierarquia que foi achatando, telas que ninguém abre há meses — só aparece olhando.

**A cada marco de produto, ou a cada ~2 meses:**

1. Suba tudo: `pnpm dev` (web em `:5173`, landing em `:5174`, API em `:3000`, Postgres em `:5434`).
2. Percorra **todas** as rotas de `routes.tsx`, em `1440x900` e em `390x844`, nos dois temas.
   Inclua as que ninguém usa — é exatamente onde a deriva se acumula.
3. Exercite os estados que uma navegação feliz não mostra: formulário submetido vazio, lista
   vazia, lista carregando, erro de API, diálogo aberto em tela baixa.
4. Meça os contrastes (§6). Não confie no olho: `--warning` *parecia* legível em 4.48:1.
5. O que quebrou vira bug em `.wolf/buglog.json` com a tag `ui`, priorizado como em
   `UI-GUIDELINES.md` §4.
6. O que quebrou **e era mecanicamente detectável** vira uma regra nova em
   `scripts/check-design.mjs`. Toda auditoria deve deixar o checker mais forte que antes — se
   não deixou, a próxima auditoria vai reencontrar a mesma classe de problema.

### Contas de teste

Precisam existir duas, porque metade dos estados só aparece numa conta vazia:

- uma com estabelecimento e dados (`ui-critic-01@zello.test` / `senha12345`);
- uma recém-registrada, sem estabelecimento, para `/onboarding` e para o dashboard de
  primeiros passos. Usuário com `establishmentId` é redirecionado para `/dashboard` — não dá
  para ver `/onboarding` sem criar uma conta nova.

Para telas públicas sem perder a sessão: `new_page` com `isolatedContext`.

---

## 6. Como medir contraste

Estimar contraste a olho falha, e falha justamente na faixa perigosa — entre 3:1 e 5:1, onde
está a maioria das decisões. Com as duas cores em mãos:

```js
const hex = h => { const n = parseInt(h.slice(1), 16); return [(n>>16)&255, (n>>8)&255, n&255] }
const lum = c => { const s = c.map(v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4) })
                   return 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2] }
const ratio = (a, b) => { const [l1, l2] = [lum(hex(a)), lum(hex(b))]
                          const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
                          return +((hi + 0.05) / (lo + 0.05)).toFixed(2) }
```

**Meça contra a superfície real.** Um texto dentro de um card se mede contra `--card`
(`#f7f8f5`), não contra `--background` (`#f0f2ee`). Os dois diferem o bastante para mover o
resultado na terceira casa — o suficiente para atravessar um limite.

**Os limites não são todos iguais.** A WCAG 1.4.11 exige 3:1 para o contorno de um **controle de
formulário**. Divisória, contorno de card e textura decorativa não caem nessa regra, e forçá-los
a 3:1 deixa a página riscada. Por isso há três tokens de borda, e por isso `--border` está em
2.07:1 de propósito. Ver `UI-GUIDELINES.md` §3.1.

---

## 7. Livro de exceções

Toda exceção viva no código aparece aqui. Exceção que sai do código sai desta tabela.

| id | Onde | Motivo | Data |
|---|---|---|---|
| C3 | `pages/login.tsx` | Tela pública na moldura do `AuthLayout` — um cartão estreito e centrado. A régua e o tique dourado do `PageHeader` são vocabulário do painel. | 2026-09-15 |
| C3 | `pages/register.tsx` | Mesmo motivo. | 2026-09-15 |

---

## 8. Estendendo o sistema

**Token novo** — só se duas telas independentes precisarem dele. Um uso é um caso particular,
não um token. Entra em `theme.css` (claro **e** escuro), é registrado no `@theme inline` de
`apps/web/src/index.css`, tem o contraste medido e documentado em comentário, e a landing é
verificada.

**Componente de moldura novo** — só se o padrão aparecer três vezes. Vai para `components/`
(não `components/ui/`, que é território do shadcn), com um comentário de cabeçalho dizendo **por
que existe**, não o que faz. Entra na tabela do §1.

**Primitivo novo** — `pnpm dlx shadcn@latest add <componente>` de dentro de `apps/web`, nunca da
raiz do monorepo, senão o CLI não acha o `components.json`. Depois do add, revise o que veio: o
shadcn gera `ring-foreground/10` e overlays `bg-black/10`, que são exatamente as duas coisas que
já vazaram para cá — troque por `ring-border` e `bg-foreground/40`.

**Invariante novo** — se for detectável no código-fonte, escreva a regra em
`scripts/check-design.mjs` com `id`, `title`, `why` e uma mensagem que diga o que fazer, e
**teste que ela pega** semeando uma violação antes de confiar nela. Se não for detectável, entra
na tabela H do §2 e no checklist do §4.

---

## 9. Limites honestos deste contrato

- O `check:design` faz correspondência de texto sobre o código-fonte. Ele não entende o DOM, não
  resolve classes montadas em variável e não sabe o que a página realmente pinta. **"Passou" não
  quer dizer "está bom"** — quer dizer que nenhuma das cinco armadilhas conhecidas apareceu.
- Os invariantes H dependem de alguém executar. Um checklist só funciona enquanto for curto o
  bastante para ser lido; se crescer, corte, não ignore.
- Contraste não é acessibilidade. Leitor de tela, ordem de foco, redução de movimento e
  linguagem clara continuam fora de qualquer verificação automática daqui.
- Nada aqui julga se a tela resolve o problema de quem usa. O contrato impede que a UI **piore
  sem que ninguém perceba**; não a faz ficar boa. Isso ainda é trabalho de design.
