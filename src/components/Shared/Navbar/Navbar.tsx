// components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Heart,
  Stethoscope,
  Activity,
  Bell,
  Search,
  Shield,
  Calendar,
  FileText,
  Home,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useUserInfo from "@/hooks/useUserInfo";
import { logoutUser } from "@/services/actions/logoutUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const userInfo = useUserInfo();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const handleLogOut = () => {
    logoutUser(router);
  };

  const navigationItems = [
    // { name: "Consultation", href: "/consultation", icon: Stethoscope },
    { name: "Doctors", href: "/doctors", icon: User },
    // { name: "Diagnostics", href: "/diagnostics", icon: Activity },
    // { name: "Health Plans", href: "/plans", icon: Heart },
  ];

  const userMenuItems = [
    { name: "Dashboard", href: `/dashboard/${userInfo?.role}`, icon: Shield },
    {
      name: "Profile",
      href: `/dashboard/${userInfo?.role}/profile`,
      icon: User,
    },
    {
      name: "Appointments",
      href: `/dashboard/${userInfo?.role}/appointments`,
      icon: Calendar,
    },
    // { name: "Medical Records", href: "/records", icon: FileText },
    // { name: "Settings", href: "/settings", icon: Settings }consultya
  ];

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md border-b",
        isScrolled
          ? "bg-white/90 dark:bg-slate-900/90 border-slate-200/50 dark:border-slate-700/50 shadow-sm"
          : "bg-white/80 dark:bg-slate-900/80 border-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  healthBridge
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Healthcare Platform
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="group relative flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* User Menu or Login Button */}
            {userInfo?.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0"
                    >
                      <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                        <AvatarImage
                          src={userInfo?.profilePhoto}
                          alt={userInfo?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                          {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{userInfo?.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {userInfo?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                >
                  <Link href="/login">
                    {/* <User className="mr-2 h-4 w-4" /> */}
                    Login
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <SheetTitle className="text-lg font-semibold">
                      Menu
                    </SheetTitle>
                  </div>

                  {/* User Info */}
                  {userInfo?.email && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg mb-6">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={userInfo?.profilePhoto}
                          alt={userInfo?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {userInfo?.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {userInfo?.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {userInfo?.email}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        {userInfo?.role}
                      </Badge>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <nav className="flex-1 space-y-2">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-3">
                        Main Menu
                      </p>
                      {navigationItems.map((item) => (
                        <Button
                          key={item.name}
                          variant="ghost"
                          className="w-full justify-start h-12 px-3"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href={item.href}>
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.name}
                          </Link>
                        </Button>
                      ))}
                    </div>

                    <Separator />

                    {/* User Menu Items */}
                    {userInfo?.email && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-3">
                          Account
                        </p>
                        {userMenuItems.map((item) => (
                          <Button
                            key={item.name}
                            variant="ghost"
                            className="w-full justify-start h-12 px-3"
                            asChild
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link href={item.href}>
                              <item.icon className="mr-3 h-4 w-4" />
                              {item.name}
                            </Link>
                          </Button>
                        ))}
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 px-3 text-red-600 dark:text-red-400"
                          onClick={() => {
                            handleLogOut();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    )}
                  </nav>

                  {/* Footer */}
                  <div className="pt-6 border-t">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>healthBridge v2.0</span>
                      <span>© 2024</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
