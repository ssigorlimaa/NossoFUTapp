-- NossoFUTapp: verificação de produção
-- Execute no SQL Editor do Supabase.

select *
from pg_publication_tables
where pubname = 'supabase_realtime'
  and schemaname = 'public'
  and tablename in ('matches', 'match_events');

-- Execute SOMENTE se a tabela correspondente não aparecer acima:
-- alter publication supabase_realtime add table public.matches;
-- alter publication supabase_realtime add table public.match_events;

select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('leagues', 'teams', 'matches', 'match_events', 'news');

-- Não crie INSERT/UPDATE/DELETE públicos.
-- A Home pública deve ter apenas SELECT permitido por RLS.
