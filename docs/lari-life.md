# Lari's life — painel pessoal em `/life`

Área privada do portfólio para organizar a vida: hoje, tarefas, metas, hábitos,
finanças (com gráficos e investimentos), desejos, projetos, calendário, bem-estar,
momentos, pessoas, viagens, lar & gatos e mercado.

## Como funciona

- **Acesso:** a página `/life` pede uma senha. As rotas de dados exigem um cookie
  httpOnly assinado; sem a senha nada é devolvido pelo servidor.
- **Banco:** Postgres no Neon, acessado com Drizzle ORM. Cada coleção do app é uma tabela
  (`life_tasks`, `life_transactions`, `life_books`...). O item completo fica em `data` (jsonb),
  com colunas de data e posição para consultas e ordem.
- **Cache local:** o navegador guarda uma cópia para abrir na hora e funcionar offline;
  alterações pendentes são enviadas quando a conexão volta.
- **Vários aparelhos:** computador e celular leem o mesmo banco.

## Configurar o banco (uma vez)

1. Na Vercel, abra o projeto → **Storage → Marketplace → Neon** e conecte. A variável `DATABASE_URL` é criada.
2. Aplique as migrações no banco (uma vez e a cada mudança de schema):

   ```bash
   DATABASE_URL="postgres://..." pnpm db:migrate
   ```

3. Faça o deploy. O app não cria tabelas sozinho: rode `db:migrate` antes de publicar mudanças de schema.

Para desenvolver localmente, use qualquer Postgres (por exemplo, `docker run -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16`)
e defina `DATABASE_URL=postgres://postgres:dev@localhost:5432/postgres` no `.env.local`.
Sem `DATABASE_URL` em desenvolvimento, os dados vão para `.life-data/` (ignorado pelo git).

## Variáveis de ambiente

| Variável | Obrigatória | O que é |
| --- | --- | --- |
| `LIFE_PASSCODE` | sim | Senha para entrar em `/life`. |
| `LIFE_SESSION_SECRET` | não | Chave usada para assinar a sessão. Se ausente, usa a própria `LIFE_PASSCODE`. |
| `DATABASE_URL` | sim em produção | Conexão Postgres (Neon). |

Para gerar novas migrações depois de mudar `lib/life/db/schema.ts`: `pnpm db:generate`.

## Rotas

- `/life` — o app (fora do sistema de idiomas; não é indexado).
- `/api/life/session` — `GET` estado da sessão, `POST` login, `DELETE` sair.
- `/api/life/data` — `GET` carrega os dados, `PUT` grava o documento inteiro (transação no banco).

## Estrutura do código

- `lib/life/` — tipos, datas, formatação, cálculos puros (`selectors.ts`), auth e storage do servidor (`server/store.ts`).
- `lib/life/db/` — schema do Drizzle e conexão com o Postgres. Migrações em `drizzle/`.
- `components/life/` — store cliente (`store.tsx`), tema, shell de navegação, primitivos de UI e uma pasta `views/` por módulo.
- `app/life/` — rota e estilos próprios (`life.css`), com tokens de cor para claro e escuro.

## Google Calendar

Mostra seus eventos do Google Calendar no `/life` (calendário, agenda do Hoje). É somente leitura:
os eventos não são copiados para o app, são buscados a cada abertura.

### Configurar no Google Cloud (uma vez)

1. Em console.cloud.google.com, crie um projeto e ative a **Google Calendar API** (APIs & Services → Library).
2. Em **OAuth consent screen**, escolha *External*, dê um nome ao app e adicione o escopo
   `.../auth/calendar.readonly`. Inclua o seu e-mail como *test user*.
   Recomendo publicar o app (*Publish app*): em modo de teste o Google expira o acesso a cada 7 dias.
3. Em **Credentials → Create credentials → OAuth client ID**, tipo *Web application*, e em
   *Authorized redirect URIs* adicione:
   - `https://larissasoares.dev/api/life/google/callback`
   - `http://localhost:3000/api/life/google/callback` (para desenvolvimento)

### Variáveis de ambiente

| Variável | Obrigatória | O que é |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | sim | Client ID do OAuth. |
| `GOOGLE_CLIENT_SECRET` | sim | Client secret do OAuth. |
| `GOOGLE_REDIRECT_URI` | não | Padrão: `NEXT_PUBLIC_SITE_URL` + `/api/life/google/callback`. |

Depois de configurar, abra `/life`, vá em **Calendário** e toque em **Conectar Google Calendar**.
O refresh token é guardado cifrado (AES-256-GCM) no mesmo armazenamento do app.
Para desconectar, use o botão **Desconectar** na tela de calendário.
