"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconBell, IconSearch } from "@tabler/icons-react"
import Link from "next/link"

export function SiteHeader() {
  const pathname = usePathname()

  // Clean up the title: /admin/customers -> Customers
  const getTitle = () => {
    const segment = pathname.split("/").pop() || "Dashboard"
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        <h1 className="text-sm font-semibold text-gray-900 sm:text-base">
          {getTitle()}
        </h1>

        <div className="ml-auto flex items-center gap-2 lg:gap-4">
          {/* Quick Search Icon */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <IconSearch size={18} />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
            <IconBell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
          </Button>

          <Separator orientation="vertical" className="h-4 hidden sm:block" />

          <Link href="/admin/veiwstore">
            <Button variant="outline" size="sm" className="h-8 gap-2 cursor-pointer ">
              View Store
            </Button>
          </Link>
          
        </div>
      </div>
    </header>
  )
}