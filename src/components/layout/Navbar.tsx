'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/scenarios', label: 'Scenarios' },
  { href: '/explorer', label: 'Explorer' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-12 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#2a2a3a] flex items-center px-4">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
        <span className="text-sm font-semibold tracking-tight text-[#e4e4ef]">
          AI INFLATION SIM
        </span>
        <span className="text-[10px] text-[#606070] ml-1">v1.0</span>
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                isActive
                  ? 'bg-[#1a1a24] text-[#e4e4ef] border border-[#2a2a3a]'
                  : 'text-[#9898aa] hover:text-[#e4e4ef] hover:bg-[#111118]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-3 text-[10px] text-[#606070]">
        <span>BLS CPI-U Dec 2025</span>
        <span className="text-[#9898aa]">2.7% YoY</span>
      </div>
    </nav>
  );
}
