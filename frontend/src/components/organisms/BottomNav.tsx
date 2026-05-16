'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Scale, Utensils, Dumbbell } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'ホーム',  Icon: LayoutDashboard },
  { href: '/weight',    label: '体重',    Icon: Scale },
  { href: '/meal',      label: '食事',    Icon: Utensils },
  { href: '/exercise',  label: '運動',    Icon: Dumbbell },
]

export default function BottomNav() {
  // 現在のパスを取得
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
      <div className="flex">
        {navItems.map(({ href, label, Icon }) => {
          // 現在のパスとリンクのパスを比較して、アクティブな状態を判断
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-3 transition-colors duration-200"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-sky-500' : 'text-gray-400'}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-sky-500' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
