'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      // signOutAction ends with redirect('/login') on the server, which
      // throws NEXT_REDIRECT. When invoked from an onClick handler,
      // Next 16 doesn't always forward that into client navigation —
      // so we catch it and push the router manually. The server-side
      // work (invalidate session, clear cookie) is already done by the
      // time the throw reaches us.
      try {
        await signOutAction()
      } catch {
        // NEXT_REDIRECT or any other rejection — we navigate regardless.
      }
      router.push('/login')
      router.refresh()
    })
  }

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
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          onClick={handleSignOut}
        >
          <LogOut /> ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
