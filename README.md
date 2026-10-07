# NossoFUTapp

Home mobile-first para o NossoFUT, usando Next.js App Router, TypeScript, Tailwind CSS, TanStack Query e Supabase.

## Requisitos

- Node.js 20.9+ (recomendado LTS)
- Projeto Supabase
- GitHub
- Vercel

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000.

## Variáveis

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Validação local

```bash
npm run typecheck
npm run build
npm run start
```

## Supabase

A Home lê `leagues`, `teams`, `matches` e usa Realtime em `matches` e `match_events`.

As tabelas precisam ter RLS e políticas de SELECT compatíveis com o acesso público definido pelo produto. Não coloque service_role key no frontend.

Verifique a publicação Realtime:

```sql
select *
from pg_publication_tables
where pubname = 'supabase_realtime'
  and schemaname = 'public'
  and tablename in ('matches', 'match_events');
```

Se uma das tabelas não aparecer:

```sql
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.match_events;
```

## Vercel

Importe o repositório no Vercel e adicione:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Build command: `npm run build`

Output: automático para Next.js.

## Observação sobre dados

A aplicação não gera placares por conta própria. `matches` é a fonte de verdade. Um alimentador externo, Edge Function ou painel administrativo deverá inserir/atualizar os jogos.

## Segurança

- Nunca use `SUPABASE_SERVICE_ROLE_KEY` no cliente.
- A chave anon/publishable só deve acessar dados permitidos por RLS.
- Realtime respeita as políticas de leitura da tabela.


## Dados reais

O app lê `matches`, `teams` e `leagues` do Supabase. A Edge Function `sync-football` sincroniza a agenda diária do TheSportsDB. O botão de atualização força uma nova leitura do banco; o Realtime invalida as consultas quando `matches` ou `match_events` mudam.
