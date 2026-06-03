import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui/Display'
import { FaqList } from '@/features/support/components/FaqList'
import { ContactForm } from '@/features/support/components/ContactForm'
import { SupportContactInfo } from '@/features/support/components/SupportContactInfo'
import { SupportQuickCards } from '@/features/support/components/SupportQuickCards'

const SupportPage = () => {
  const t = useTranslations('support')
  return (
    <div className="p-5 sm:p-8 flex flex-col gap-6">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <SupportQuickCards />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <FaqList />
        <div className="flex flex-col gap-4">
          <ContactForm />
          <SupportContactInfo />
        </div>
      </div>
    </div>
  )
}

export default SupportPage
