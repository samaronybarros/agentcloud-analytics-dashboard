export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <nav className="w-56 shrink-0 border-r border-gray-200 bg-white px-4 py-6">
        <h1 className="mb-8 text-lg font-semibold tracking-tight">
          AgentCloud
        </h1>
        <ul className="space-y-1 text-sm">
          <li>
            <a
              href="/dashboard"
              className="block rounded-md px-3 py-2 font-medium text-gray-900 hover:bg-gray-100"
            >
              Overview
            </a>
          </li>
          <li>
            <a
              href="/dashboard/agents"
              className="block rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              Agents
            </a>
          </li>
          <li>
            <a
              href="/dashboard/teams"
              className="block rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              Teams
            </a>
          </li>
          <li>
            <a
              href="/dashboard/optimization"
              className="block rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              Optimization
            </a>
          </li>
        </ul>
      </nav>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
