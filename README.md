# LAN Frontend

Interface web do LAN, sistema de gestão para barbearias e salões. O projeto acompanha clientes, profissionais, serviços, atendimentos, pagamentos e movimentações financeiras em desktop e dispositivos móveis.

## Funcionalidades

- autenticação por cookies HttpOnly com renovação automática;
- dashboard com valores pagos, pendentes, rankings e evolução do período;
- cadastro e gestão de clientes, contatos e situação;
- análise de fidelidade calculada sobre todos os clientes;
- cadastro de profissionais e serviços autorizados;
- catálogo de serviços e preços;
- registro de atendimentos com múltiplos serviços, profissionais e desconto;
- pagamentos totais ou parciais e uso de crédito do cliente;
- fluxo de caixa com receitas, despesas, pendências e estornos;
- histórico com filtros por período, serviço, profissional e pagamento;
- interface responsiva em português e inglês;
- feedback por toast e carregamento unificado da área de conteúdo.

## Tecnologias

| Área | Tecnologia |
| --- | --- |
| Framework | Next.js 16 com App Router |
| Interface | React 19 e Tailwind CSS 4 |
| Linguagem | TypeScript |
| Consultas | TanStack React Query 5 |
| HTTP | Axios |
| Formulários | React Hook Form e Zod |
| Estado local | Zustand |
| Gráficos | Recharts |
| Traduções | next-intl |
| Notificações | react-hot-toast |

## Requisitos

- Node.js 20 ou superior
- npm
- LAN API em execução

## Configuração local

Instale as dependências:

```bash
npm install
```

Crie `.env.local` a partir de `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Inicie o projeto:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

`NEXT_PUBLIC_API_URL` é uma configuração pública incorporada ao JavaScript durante o build. Ela deve conter apenas o endereço público da API, nunca senhas, tokens, segredos JWT ou a URL do banco.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o Next.js em desenvolvimento |
| `npm run build` | Cria o build de produção |
| `npm run start` | Executa o build criado |
| `npm run lint` | Verifica o código com ESLint |

## Estrutura

```text
src/
├── app/          # rotas públicas e autenticadas
├── components/   # componentes de interface, layout e gráficos
├── features/     # módulos por domínio do sistema
├── hooks/        # hooks compartilhados
├── i18n/         # configuração de idioma
├── lib/          # cliente HTTP, mensagens e utilitários
├── providers/    # provedores React
└── stores/       # estado da sessão, interface e idioma
```

Cada domínio reúne suas chamadas HTTP, hooks, componentes e validações em `src/features`.

## Sessão e comunicação com a API

O Axios envia cookies com `withCredentials: true` e inclui `X-CSRF-Protection: 1`. Ao receber `401`, o front tenta renovar a sessão uma vez e repete a requisição original. A renovação é coordenada entre abas para reduzir conflitos.

Os tokens não ficam acessíveis ao JavaScript. Ao abrir o sistema, `/users/me` restaura a sessão a partir dos cookies da API.

No ambiente publicado:

- front: `https://app.jdbarbeariatapuio.com.br`;
- API: `https://api.jdbarbeariatapuio.com.br`.

## Carregamento de dados

O primeiro carregamento mostra o Luma Spin sobre toda a área de conteúdo. Em paginações e filtros, os dados anteriores permanecem visíveis sob o fundo de carregamento até a nova resposta. A área principal fica bloqueada durante a consulta, enquanto o menu continua disponível.

## Deploy na Vercel

Configure a variável abaixo para os ambientes desejados:

```env
NEXT_PUBLIC_API_URL=https://api.jdbarbeariatapuio.com.br
```

Ela deve ser cadastrada como configuração comum, pois o endereço da API é público. Depois de alterar uma variável `NEXT_PUBLIC_`, faça um novo deploy para gerar o front com o novo valor.

O domínio de produção esperado é `app.jdbarbeariatapuio.com.br` e precisa estar autorizado pelo CORS do backend.

## Licença

Projeto privado. Todos os direitos reservados.
