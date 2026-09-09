import { Sidebar } from './Sidebar'
import { Topbar }  from './Topbar'
import { ContentLoadingOverlay } from './ContentLoadingOverlay'

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-dvh overflow-hidden">
    <Sidebar />
    <div className="relative flex flex-col flex-1 min-w-0 overflow-hidden">
      <ContentLoadingOverlay />
      <Topbar />
      <main id="main-content" className="flex-1 overflow-y-auto pb-6">
        {children}
      </main>
    </div>
  </div>
)
