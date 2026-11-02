# Validações e troca de senha

A troca de senha fica em **Configurações → Trocar senha**. Ela exige senha atual, nova senha e confirmação. A nova senha tem no mínimo 8 caracteres e no máximo 72 bytes UTF-8, sem remover espaços da senha. Cadastro de conta usa a mesma política. Login e conferência da senha atual continuam aceitando senhas antigas.

A API confere a senha atual com bcrypt, grava somente o hash e incrementa a versão das sessões junto com a exclusão dos tokens de atualização, em uma transação. Após o sucesso, os cookies e o estado local são limpos; todos os dispositivos precisam entrar novamente. A rota usa a identidade autenticada e limita tentativas. Alterar o perfil não permite enviar uma senha por outro caminho.

## Regras nos dois projetos

Os formulários validam entradas e os módulos de API do frontend validam os dados enviados. A API valida novamente cada operação e suas regras de negócio. Os testes de compatibilidade comparam casos válidos e inválidos dos dois projetos; não basta alterar apenas uma cópia das regras.

| Dados                             | Regra                                                                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome                              | 2 a 100 caracteres, desconsiderando espaços nas pontas.                                                                                                  |
| E-mail                            | Formato válido e até 254 caracteres.                                                                                                                     |
| Endereço                          | Opcional, até 300 caracteres.                                                                                                                            |
| Telefone                          | Opcional; quando preenchido, 8 a 15 dígitos.                                                                                                             |
| WhatsApp                          | Opcional; número completo com DDI deve ter 8 a 15 dígitos.                                                                                               |
| Instagram                         | Opcional; até 30 letras, números, pontos ou sublinhados, com remoção do `@` inicial.                                                                     |
| Valores e descontos               | Número finito, de 0 a 999.999,99, em centavos. Entradas financeiras e parcelas enviadas exigem valor positivo. Desconto não pode ultrapassar o subtotal. |
| Descrição financeira e de serviço | Opcional, até 300 caracteres.                                                                                                                            |
| Observações de atendimento        | Opcionais, até 2.000 caracteres.                                                                                                                         |
| Fotos enviadas                    | Data URL JPEG/PNG/WebP, até 700.000 caracteres. O navegador também prepara e reduz a imagem original antes do envio.                                     |
| Atendimento                       | Cliente, data válida e 1 a 50 serviços diferentes com profissional. A API confirma preços, vínculos e titularidade.                                      |
| Crédito                           | Cliente obrigatório ao gerar adiantamento; uso limitado ao saldo e ao valor em aberto. A API reconfirma o saldo dentro da transação.                     |
| Financeiro                        | Data válida; pagamentos confirmados não podem estar no futuro, com tolerância de um minuto. Lançamentos pendentes podem ter vencimento futuro.           |
| Estorno/cancelamento financeiro   | Motivo de 3 a 200 caracteres.                                                                                                                            |
| Filtros                           | Identificadores UUID, busca de até 200 caracteres, paginação positiva e limitada, datas reais e intervalo em ordem.                                      |

Senha atual, existência de registros, duplicidades, permissões, vínculo entre profissional e serviço e saldo disponível dependem dos dados do servidor. O frontend verifica campos e seleções e apresenta as rejeições do servidor; ele não recebe hashes de senha nem substitui as decisões da API.

## Verificação

Nos dois projetos: `node node_modules/typescript/bin/tsc --noEmit`.

No frontend: `node node_modules/eslint/bin/eslint.js src`.

No backend: `node --import tsx --test tests/change-password.test.mjs tests/validation-parity.test.mjs tests/appointment-credit.test.mjs tests/form-requirements.test.mjs tests/professional-tenancy.test.mjs`.

Os testes usam banco simulado. Os testes de compatibilidade procuram o frontend no diretório vizinho `lan-front`; mantenha os dois projetos disponíveis para executar essa comparação.

Frontend e API precisam ser publicados juntos, inclusive para o cadastro de conta enviar confirmação de senha e aceite dos termos.
