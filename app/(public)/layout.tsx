import FooterPremium from '@/components/FooterPremium'
import WhatsAppChat from '@/components/WhatsAppChat'
import AIChatbot from '@/components/AIChatbot'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {children}
      </div>
      <FooterPremium />
      <WhatsAppChat />
      <AIChatbot />
    </div>
  )
}
