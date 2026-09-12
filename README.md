# zello-web

Monorepo Turborepo + pnpm com a API e as apps web do Zello.

## Estrutura

```
apps/
  api/       NestJS + Prisma + PostgreSQL
  landing/   Landing page pública (Vite + React + TS)
  web/       Dashboard autenticado (Vite + React + TS)
packages/
  ui/        Componentes shadcn/ui compartilhados + tokens de design
  config/    tsconfig e eslint compartilhados
  types/     Tipos/DTOs TypeScript compartilhados entre api e frontends
```

O banco de dados é **PostgreSQL self-hosted** (VM Vultr) — não é Supabase nem MySQL.

## Setup

```sh
pnpm install
```

Configure a conexão com o banco em `apps/api/.env` (`DATABASE_URL`), copiando o formato do `postgresql://...` que já vem no arquivo.

## Desenvolvimento

```sh
pnpm dev
```

Roda `api`, `landing` e `web` em paralelo via Turborepo. Para rodar apenas um:

```sh
pnpm turbo dev --filter=web
pnpm turbo dev --filter=api
```

## Outras tasks

```sh
pnpm build      # build de todos os apps/packages
pnpm lint       # lint em todo o monorepo
pnpm typecheck  # checagem de tipos em todo o monorepo
```
