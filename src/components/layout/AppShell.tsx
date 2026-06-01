import { Sidebar } from './Sidebar'
import { Topbar }  from './Topbar'

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <Topbar />
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  </div>
)
