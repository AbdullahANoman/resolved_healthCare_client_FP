// components/dashboard/DashboardDrawer.tsx
"use client";

import * as React from "react";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Sidebar from "../SideBar/SideBar";
import { logoutUser } from "@/services/actions/logoutUser";
import { useRouter } from "next/navigation";

export default function DashboardDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useGetSingleUserQuery({});
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleLogOut = () => {
    logoutUser(router);
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileOpen}
        onClose={handleDrawerClose}
        isMobile={true}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isOpen={true} onClose={() => {}} isMobile={false} />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-80">
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDrawerToggle}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {getCurrentTime()}, {isLoading ? "..." : data?.name}! 👋
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Welcome back to healthBridge
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-semibold"
                    >
                      Online
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-40 lg:w-64 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                      <AvatarImage
                        src={data?.profilePhoto}
                        alt={data?.name}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                        {data?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{data?.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {data?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogOut} className="text-red-600 dark:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
