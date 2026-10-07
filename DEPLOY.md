# NossoFUTapp — implantação

## 1. Supabase

1. Abra o projeto Supabase.
2. Em Project Settings → API, copie:
   - Project URL
   - anon key (ou a chave pública equivalente do projeto)
3. Confirme que RLS está habilitado nas tabelas.
4. Execute `supabase-production-check.sql` no SQL Editor.
5. Confirme que `matches` e `match_events` aparecem em `supabase_realtime`.
6. Confirme que as políticas de SELECT permitem ao papel usado pelo app ler os dados necessários.

O app nunca deve receber `service_role`.

## 2. GitHub

Se você já possui `riquelmed1-lab/NossoFUTapp`, copie estes arquivos para a raiz do repositório.

Depois:

```bash
git add .
git commit -m "feat: production mobile home"
git push origin main
```

Se estiver começando este diretório como um novo repositório:

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial production mobile app"
git remote add origin https://github.com/SEU_USUARIO/NossoFUTapp.git
git push -u origin main
```

## 3. Vercel

1. Entre na Vercel.
2. Add New → Project.
3. Importe `riquelmed1-lab/NossoFUTapp`.
4. Framework: Next.js (detecção automática).
5. Root Directory: `/`.
6. Não defina Output Directory manualmente.
7. Em Settings → Environment Variables, adicione para Production, Preview e Development:

```text
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE
```

8. Deploy.

Depois de salvar/alterar variáveis, faça um novo deployment.

## 4. Teste de produção

Teste:

- Home abre sem erro.
- Filtros por liga.
- Mudança de dia.
- Partidas ao vivo.
- Alteração de placar no Supabase aparece no navegador sem F5.
- Inserção de `match_events` dispara atualização.
- Escudos carregam.
- Navegação inferior não quebra em 360px.
- PWA/manifest aparece no navegador compatível.

## 5. Teste Realtime

No SQL Editor:

```sql
update public.matches
set home_score = home_score + 1,
    updated_at = now()
where id = 'UUID_DE_UMA_PARTIDA';
```

Com a Home aberta, o placar deve mudar automaticamente.

Se não mudar, verifique nesta ordem:

1. tabela na publicação `supabase_realtime`;
2. RLS/SELECT;
3. logs do Realtime;
4. console do navegador;
5. conexão WebSocket.

## 6. Domínio

Depois que o Vercel estiver funcionando:

Project → Settings → Domains → Add.

O app pode continuar acessível pelo domínio `*.vercel.app` enquanto o domínio próprio não estiver configurado.

## 7. Atualizações futuras

O fluxo recomendado será:

```text
desenvolvimento
    ↓
GitHub branch
    ↓
Vercel Preview
    ↓
teste no celular
    ↓
merge em main
    ↓
Vercel Production
```
