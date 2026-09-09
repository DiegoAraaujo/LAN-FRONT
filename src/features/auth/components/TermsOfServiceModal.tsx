'use client'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface TermsOfServiceModalProps {
  open: boolean
  onClose: () => void
  onAccept: () => void
}

const sections = [
  {
    title: '1. Sobre o LAN',
    content: 'O LAN é um sistema de gestão destinado a barbearias e salões. A plataforma permite organizar clientes, profissionais, serviços, atendimentos, pagamentos e movimentações financeiras.',
  },
  {
    title: '2. Cadastro e acesso',
    content: 'Para utilizar o sistema, você deve fornecer informações verdadeiras, manter seus dados atualizados e proteger sua senha. A conta é pessoal, e você é responsável pelas ações realizadas por meio dela. Avise o responsável pelo LAN caso suspeite de acesso indevido.',
  },
  {
    title: '3. Uso permitido',
    content: 'Você pode usar o LAN somente para fins lícitos relacionados à gestão do seu negócio. É proibido tentar acessar contas ou dados de terceiros, comprometer a segurança do serviço, inserir conteúdo ilícito ou utilizar a plataforma para fraude.',
  },
  {
    title: '4. Dados de clientes e profissionais',
    content: 'Ao cadastrar dados de clientes e profissionais, você declara possuir uma base legal válida para esse tratamento e se responsabiliza por informar os titulares. O LAN trata esses dados para executar as funções solicitadas pela sua conta e proteger o funcionamento da plataforma.',
  },
  {
    title: '5. Informações financeiras',
    content: 'Os recursos de caixa, valores pagos, pendências, receitas e despesas têm finalidade de organização gerencial. Eles não substituem contabilidade profissional, documentos fiscais, extratos bancários ou orientação financeira.',
  },
  {
    title: '6. Disponibilidade e alterações',
    content: 'Buscamos manter o sistema disponível e seguro, mas podem ocorrer interrupções para manutenção, atualização ou por falhas externas. Funcionalidades podem ser ajustadas para melhorar o serviço, preservar a segurança ou atender exigências legais.',
  },
  {
    title: '7. Propriedade intelectual',
    content: 'O software, a identidade visual e os elementos próprios do LAN são protegidos pela legislação aplicável. O uso da plataforma não transfere ao usuário direitos sobre o código, a marca ou outros ativos do serviço.',
  },
  {
    title: '8. Suspensão e encerramento',
    content: 'A conta pode ser suspensa em caso de violação destes termos, risco à segurança, fraude ou determinação legal. Você pode deixar de utilizar o serviço e solicitar o encerramento da conta pelos canais oficiais disponibilizados pelo responsável pelo LAN.',
  },
  {
    title: '9. Privacidade e segurança',
    content: 'Os dados pessoais devem ser tratados de acordo com a Lei Geral de Proteção de Dados. São aplicadas medidas de acesso e segurança compatíveis com o serviço, sem garantia de proteção absoluta contra todos os incidentes possíveis.',
  },
  {
    title: '10. Atualização dos termos',
    content: 'Estes termos podem ser atualizados quando houver mudanças relevantes no serviço ou na legislação. Quando necessário, uma nova aceitação poderá ser solicitada. A legislação brasileira rege o uso do LAN.',
  },
]

export const TermsOfServiceModal = ({ open, onClose, onAccept }: TermsOfServiceModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Termos de Serviço"
    size="xl"
    footer={
      <>
        <Button type="button" variant="outline" onClick={onClose}>Fechar</Button>
        <Button type="button" variant="primary" onClick={onAccept}>Aceitar e continuar</Button>
      </>
    }
  >
    <div className="space-y-6 text-sm leading-relaxed text-text-muted">
      <div className="rounded-xl border border-gold-btn/30 bg-gold-light/40 p-4">
        <p className="font-semibold text-text">Versão de 9 de setembro de 2026</p>
        <p className="mt-1">Ao criar uma conta e utilizar o LAN, você concorda com as condições abaixo.</p>
      </div>

      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="mb-1.5 font-semibold text-text">{section.title}</h3>
          <p>{section.content}</p>
        </section>
      ))}

      <section className="rounded-xl bg-bg p-4">
        <h3 className="mb-1.5 font-semibold text-text">Identificação e contato</h3>
        <p>Antes da publicação comercial, o responsável pelo LAN deve informar neste documento seu nome empresarial ou nome completo, CPF ou CNPJ, endereço e um canal de contato para suporte e solicitações sobre dados pessoais.</p>
      </section>
    </div>
  </Modal>
)
