import { useState } from 'react';
import { FileTextIcon, RefreshCwIcon, ZapIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  BasicEditor,
  ConfigUpdate,
  EventCallbacks,
} from '@/components/use-cases';

type UseCaseId = 'basic-editor' | 'config-update' | 'event-callbacks';

const USE_CASES: readonly {
  id: UseCaseId;
  label: string;
  icon: typeof FileTextIcon;
  component: React.ComponentType;
}[] = [
  {
    id: 'basic-editor',
    label: 'Basic Editor',
    icon: FileTextIcon,
    component: BasicEditor,
  },
  {
    id: 'config-update',
    label: 'Config Update',
    icon: RefreshCwIcon,
    component: ConfigUpdate,
  },
  {
    id: 'event-callbacks',
    label: 'Event Callbacks',
    icon: ZapIcon,
    component: EventCallbacks,
  },
];

export function App() {
  const [activeId, setActiveId] = useState<UseCaseId>(USE_CASES[0].id);
  const activeCase = USE_CASES.find((uc) => uc.id === activeId) ?? USE_CASES[0];
  const ActiveComponent = activeCase.component;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-3">
          <span className="text-sm font-bold tracking-tight">
            OnlyOffice Playground
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Use Cases</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {USE_CASES.map((uc) => (
                  <SidebarMenuItem key={uc.id}>
                    <SidebarMenuButton
                      isActive={activeId === uc.id}
                      onClick={() => setActiveId(uc.id)}
                    >
                      <uc.icon className="size-4" />
                      <span>{uc.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 !h-4" />
          <span className="text-sm font-medium">{activeCase.label}</span>
        </header>
        <main className="flex-1 p-4 overflow-auto">
          <ActiveComponent key={activeId} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;

if (import.meta.vitest) {
  const { it, expect, beforeEach } = import.meta.vitest;
  let render: typeof import('@testing-library/react').render;

  beforeEach(async () => {
    render = (await import('@testing-library/react')).render;
  });

  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render playground title', () => {
    const { getAllByText } = render(<App />);
    expect(
      getAllByText(new RegExp('OnlyOffice Playground', 'gi')).length > 0,
    ).toBeTruthy();
  });
}
