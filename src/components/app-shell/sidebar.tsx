'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutDashboard, NotebookPen, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[] // null/empty = all
}

const NAV: NavItem[] = [
  { href: '/teacher', label: 'หน้าหลัก', icon: LayoutDashboard, roles: ['teacher'] },
  { href: '/teacher/reflections', label: 'บันทึก Reflection', icon: NotebookPen, roles: ['teacher'] },
  { href: '/school/dashboard', label: 'Dashboard โรงเรียน', icon: LayoutDashboard, roles: ['director', 'academic_lead', 'deputy_academic', 'deputy_budget', 'deputy_hr', 'deputy_general_affairs'] },
  { href: '/school/reflections', label: 'บันทึกครู', icon: BookOpen, roles: ['director', 'academic_lead', 'deputy_academic'] },
  { href: '/school/teachers', label: 'ครู', icon: Users, roles: ['director', 'academic_lead', 'deputy_academic', 'deputy_hr'] },
  { href: '/agents', label: 'AI Agents', icon: Sparkles },
]

type Props = {
  role: string
  onNavigate?: () => void
  className?: string
}

export function Sidebar({ role, onNavigate, className }: Props) {
  const pathname = usePathname()
  const items = NAV.filter((n) => !n.roles || n.roles.includes(role))

  return (
    <aside className={cn('flex flex-col gap-1 p-3', className)}>
      <div className="px-3 pb-4 pt-2">
        <Link href="/" className="text-lg font-bold gradient-text" onClick={onNavigate}>
          SchoolNextgen
        </Link>
        <p className="text-[10px] text-muted-foreground mt-0.5">ศูนย์บัญชาการผู้ช่วยครู AI</p>
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
