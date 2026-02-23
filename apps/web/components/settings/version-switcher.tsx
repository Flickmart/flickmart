'use client';

import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function ModeSwitcher({
  modes,
  defaultMode,
}: {
  modes: { id: string; name: string; description: string }[];
  defaultMode: string;
}) {
  const [selectedMode, setSelectedMode] = React.useState(defaultMode);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Mode</span>
                <span className="text-muted-foreground text-xs">
                  {selectedMode}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width]"
          >
            {modes.map((mode) => (
              <DropdownMenuItem
                key={mode.id}
                onSelect={() => setSelectedMode(mode.name)}
              >
                <div className="flex flex-col">
                  <span>{mode.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {mode.description}
                  </span>
                </div>
                {mode.name === selectedMode && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
