// components/dashboard/Sidebar.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { drawerItems } from "@/utils/drawerItems"
import type { UserRole } from "@/types"
import { getUserInfo } from "@/services/auth.services"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import logo from '../../../../public/logo.png'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

const Sidebar = ({ isOpen, onClose, isMobile = false }: SidebarProps) => {
  const [userRole, setUserRole] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const { role } = getUserInfo() as any
    setUserRole(role)
  }, [])

  if (!mounted) return null

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-600 to-purple-800 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm" />
      
      {/* Header */}
      <Link href="/">
      <div className="relative z-10 py-6 px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Image 
              src={logo} 
              width={40} 
              height={40} 
              alt="healthBridge logo" 
              className="rounded-lg"
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
              healthBridge
            </h1>
            <p className="text-xs text-white/80 font-medium uppercase tracking-wider">
              Healthcare Platform
            </p>
          </div>
        </div>
      </div>
      </Link>

      {/* User Role Badge */}
      <div className="relative z-10 px-4 mb-4">
        <Badge 
          variant="secondary" 
          className="bg-white/20 text-white border-white/30 backdrop-blur-sm font-semibold capitalize"
        >
          {userRole || "Loading..."}
        </Badge>
      </div>

      <Separator className="bg-white/20 mx-4 mb-4 relative z-10" />

      {/* Navigation Items */}
      <div className="flex-1 overflow-auto px-2 relative z-10">
        <nav className="space-y-1">
          {drawerItems(userRole as UserRole).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <SidebarItem item={item} onItemClick={onClose} />
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-white/20">
        <p className="text-center text-xs text-white/60">
          Version 2.0.1
        </p>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side="left" 
          className="w-80 p-0 border-r-0 bg-transparent"
        >
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-30">
      {sidebarContent}
    </div>
  )
}

// SidebarItem Component
interface SidebarItemProps {
  item: any
  onItemClick: () => void
}

const SidebarItem = ({ item, onItemClick }: SidebarItemProps) => {
  const linkPath = `/dashboard/${item.path}`
  const pathname = usePathname()
  const isActive = pathname === linkPath

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={linkPath} onClick={onItemClick}>
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                variant="ghost"
                className={`w-full justify-start h-12 px-3 mb-1 relative transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-lg" 
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center w-full">
                  <div className={`mr-3 transition-transform duration-300 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}>
                    {item.icon && <item.icon className="h-5 w-5" />}
                  </div>
                  <span className={`font-medium transition-all duration-300 ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}>
                    {item.title}
                  </span>
                  
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
                  )}
                </div>
                
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r" />
                )}
              </Button>
            </motion.div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {item.title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Sidebar