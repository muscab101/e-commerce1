"use client"

import * as React from "react"
import { usePathname } from "next/navigation" // Import this
import {
  IconDashboard,
  IconShoppingCart,
  IconPackages,
  IconUsers,
  IconReport,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
  IconCreditCard,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() // Get the current URL path

  const data = {
    user: {
      name: "Admin User",
      email: "admin@store.com",
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: IconDashboard,
        isActive: pathname === "/admin/dashboard", // Check if active
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: IconShoppingCart,
        isActive: pathname.startsWith("/admin/orders"), // Active for sub-items too
        items: [
          { title: "All Orders", url: "/admin/orders" },
          { title: "Pending", url: "#" },
          { title: "Completed", url: "#" },
        ],
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: IconPackages,
        isActive: pathname.startsWith("/admin/products"),
        items: [
          { title: "Inventory", url: "/admin/products" },
          { title: "Categories", url: "/admin/products/categories" },
          { title: "Price Management", url: "/admin/products/price" },
        ],
      },
      {
        title: "Customers",
        url: "/admin/customers",
        icon: IconUsers,
        isActive: pathname === "/admin/customers",
      },
    ],
    navSecondary: [
      { title: "Sales Reports", url: "#", icon: IconReport },
      { title: "Payments", url: "#", icon: IconCreditCard },
      { title: "Settings", url: "#", icon: IconSettings, isActive: pathname === "/admin/settings" },
      { title: "Help", url: "#", icon: IconHelp },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconInnerShadowTop className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">E-Comm Admin</span>
                  <span className="truncate text-xs">Management Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}