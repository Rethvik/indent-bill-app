"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  ReceiptText,
  Bot,
  ShoppingBag,
  Package,
  Database,
  Milk,
  IndianRupee,
  BanknoteArrowDown,
  UserRound,
  LogOut,
} from "lucide-react";
import Link from "next/link";
const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Indent", url: "/indent", icon: Database },
  { title: "Invoice", url: "/invoice", icon: ReceiptText },
  { title: "Purchase", url: "/purchase", icon: ShoppingBag },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Payments", url: "/payments", icon: IndianRupee },
  { title: "Customers", url: "/customers", icon: UserRound },
  { title: "Expense", url: "/", icon: BanknoteArrowDown },
];
function SideNav() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Milk />
                <span>SAI TEJA MILK DAIRY</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex" asChild>
              <span>
                <LogOut />
                LogOut
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default SideNav;
