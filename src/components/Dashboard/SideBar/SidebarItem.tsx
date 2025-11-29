// components/dashboard/SidebarItem.tsx
"use client"

import Link from "next/link"
import type { DrawerItem } from "@/types"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type SidebarItemProps = {
  item: DrawerItem
  onItemClick?: () => void
}

const SidebarItem = ({ item, onItemClick }: SidebarItemProps) => {
  const linkPath = `/dashboard/${item.path}`
  const pathname = usePathname()
  const isActive = pathname === linkPath

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mb-1 mx-1">
            <Link 
              href={linkPath} 
              className="w-full no-underline"
              onClick={onItemClick}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 px-3 relative overflow-hidden transition-all duration-300 group",
                    "rounded-xl",
                    isActive
                      ? "bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "mr-3 transition-transform duration-300 flex items-center justify-center min-w-[40px]",
                    isActive ? "scale-110" : "scale-100 group-hover:scale-105"
                  )}>
                    {item.icon && (
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        isActive 
                          ? "text-white" 
                          : "text-white/70 group-hover:text-white/90"
                      )} />
                    )}
                  </div>

                  {/* Text */}
                  <span className={cn(
                    "text-sm transition-all duration-300 truncate",
                    isActive ? "font-semibold" : "font-medium group-hover:font-semibold"
                  )}>
                    {item.title}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
                  )}

                  {/* Hover effect overlay */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Button>
              </motion.div>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-slate-900 text-white border-0">
          {item.title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default SidebarItem