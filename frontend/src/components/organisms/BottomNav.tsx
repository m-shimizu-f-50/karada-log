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
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
      <div className="flex">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-3 transition-colors duration-200"
            >
              {isActive ? (
                /* アクティブ時: グラデーションアイコン */
                <div className="relative">
                  <Icon size={22} className="text-transparent" strokeWidth={2} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      size={22}
                      strokeWidth={2}
                      style={{
                        stroke: 'url(#nav-gradient)',
                      }}
                    />
                  </div>
                  {/* SVG グラデーション定義 */}
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <linearGradient id="nav-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="50%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#f472b6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ) : (
                /* 非アクティブ時: グレーアイコン */
                <Icon size={22} className="text-gray-500" strokeWidth={2} />
              )}
              <span
                className={`text-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold'
                    : 'text-gray-500'
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
