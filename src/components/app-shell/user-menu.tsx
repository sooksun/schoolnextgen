'use client'

import { LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutAction } from '@/server/auth/actions'

type Props = {
  email: string
  displayName: string
  roleName: string
}

export function UserMenu({ email, displayName, roleName }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2">
            <span className="grid place-items-center size-7 rounded-full bg-primary/15 text-primary text-xs font-semibold">
              {displayName.slice(0, 1)}
            </span>
            <span className="hidden sm:inline text-sm truncate max-w-[10rem]">{displayName}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate">{displayName}</span>
            <span className="text-xs text-muted-foreground truncate">{email}</span>
            <span className="text-xs text-primary mt-1">{roleName}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserIcon /> โปรไฟล์ <span className="text-xs text-muted-foreground ml-auto">เร็ว ๆ นี้</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => signOutAction()}>
          <LogOut /> ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
