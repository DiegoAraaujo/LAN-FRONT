# Dashboard e melhorias de experiência

O front e o back devem ser atualizados juntos. Não há migração de banco nesta entrega.

## Indicadores

- Recebido: soma dos valores líquidos dos atendimentos pagos.
- Pendente: soma dos valores líquidos dos atendimentos pendentes.
- Total: recebido + pendente.
- Ticket médio: recebido dividido pela quantidade de atendimentos pagos.
- Novos clientes: cadastros criados dentro do período selecionado, excluindo removidos.
- Períodos usam a data do atendimento e o fuso America/Sao_Paulo, incluindo regras históricas.
- A comparação é com o mês anterior ou ano anterior completo. Uma base anterior igual a zero aparece como ausência de comparação.
- Rankings usam receitas recebidas após ratear o desconto entre os itens em centavos. A quantidade considera pagos e pendentes; o ranking de clientes prioriza quantidade.
- Como o banco não registra data de recebimento, “recebido” indica o status atual dos atendimentos do período, não fluxo de caixa pela data da baixa.

## Contratos

GET /dashboard?year=2026&month=9 mantém cards.totalRevenue, cards.totalAppointments, evolutionGraph e servicesPieGraph e adiciona pendências, totais, comparações, rankings, meios de pagamento e listas recentes.
cards.totalAppointments agora conta pagos e pendentes. Sem month, retorna o ano inteiro.

GET /users/me retorna nome, e-mail e data de criação do usuário autenticado.
O front restaura a sessão pelo refresh token, respeita “Lembrar de mim”, limpa cache ao sair e usa uma única renovação concorrente por aba, com coordenação entre abas via Web Locks quando disponível.

Pagamentos aceitam PIX, CASH, DEBIT_CARD, CREDIT_CARD e OTHER; pendentes têm paymentMethod null.
PATCH de status não aplica desconto padrão: preserva o valor existente.
Atualizações de itens revalidam o desconto contra o novo subtotal.

## Verificação

Backend: npm test (compila e executa os testes de valores, descontos, pagamento e períodos).
Frontend: npm run lint, npx tsc --noEmit --incremental false e npm run build.
Os testes de navegador foram executados com respostas de API simuladas: desktop/celular, baixa por crédito, filtros, validação, navegação por teclado, sessão restaurada, erro/recuperação, exclusão confirmada, inglês e logout.
O acesso ao banco real não foi exercitado.

A fonte Geist usa os arquivos locais incluídos na versão fixada de Next, evitando download no build. Ao atualizar Next, confira os caminhos de next/font/local em src/app/layout.tsx.
