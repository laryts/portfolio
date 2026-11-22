# Lari's life — painel pessoal em `/life`

Área privada do portfólio para organizar a vida: hoje, tarefas, metas, hábitos,
finanças (com gráficos e investimentos), desejos, projetos, calendário, bem-estar,
momentos, pessoas, viagens, lar & gatos e mercado.

## Como funciona

- **Acesso:** a página `/life` pede uma senha. As rotas de dados exigem um cookie
  httpOnly assinado; sem a senha nada é devolvido pelo servidor.
- **Persistência:** os dados são um único documento JSON salvo no servidor
  (Upstash Redis / Vercel KV via REST). O navegador guarda uma cópia local para
  abrir instantaneamente e funcionar offline; alterações pendentes são enviadas
  quando a conexão volta.
- **Vários aparelhos:** computador e celular leem o mesmo documento no servidor.
  Em caso de edição simultânea, vale a última gravação (uso pessoal, um usuário).

## Variáveis de ambiente (Vercel → Settings → Environment Variables)

| Variável | Obrigatória | O que é |
| --- | --- | --- |
| `LIFE_PASSCODE` | sim | Senha para entrar em `/life`. |
| `LIFE_SESSION_SECRET` | não | Chave usada para assinar a sessão. Se ausente, usa a própria `LIFE_PASSCODE`. |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | sim em produção | Banco onde os dados ficam. Também aceita `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Vercel KV). |

Como criar o banco: no painel da Vercel, **Storage → Marketplace → Upstash (Redis)**,
conecte ao projeto do portfólio. As variáveis REST são criadas automaticamente.

Em desenvolvimento local (`pnpm dev`) não é preciso banco: os dados vão para
`.life-data/life.json` (ignorado pelo git). Defina `LIFE_PASSCODE` no `.env.local`.

## Rotas

- `/life` — o app (fora do sistema de idiomas; não é indexado).
- `/api/life/session` — `GET` estado da sessão, `POST` login, `DELETE` sair.
- `/api/life/data` — `GET` carrega os dados, `PUT` grava o documento inteiro.

## Estrutura do código

- `lib/life/` — tipos, datas, formatação, cálculos puros (`selectors.ts`), auth e storage do servidor.
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
