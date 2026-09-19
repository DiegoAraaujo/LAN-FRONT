# LAN Frontend

Interface web do LAN, um sistema de gestão para barbearias e salões com clientes, profissionais, serviços, atendimentos, pagamentos, fluxo de caixa e indicadores.

## Stack

- Next.js 16, React 19 e TypeScript
- Tailwind CSS 4
- TanStack React Query e Axios
- React Hook Form e Zod
- Zustand, Recharts e next-intl

## Rodando localmente

Requisitos: Node.js 20+, npm e a LAN API em execução.

```bash
git clone https://github.com/DiegoAraaujo/LAN-FRONT.git
cd LAN-FRONT
npm install
```

Copie `.env.example` para `.env.local` e informe a URL local da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Inicie a aplicação:

```bash
npm run dev
```

Acesse `http://localhost:3000`.
