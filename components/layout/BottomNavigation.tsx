/* ボトムナビゲーション */
import { CgProfile, CgSearch } from "react-icons/cg";
import { TbFridge } from "react-icons/tb";

import Link from "next/link";

type NavItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
  pageKey: string;
  isCenter: boolean;
};

const navs: readonly NavItem[] = [
  {
    href: "/items",
    icon: <CgSearch className="text-3xl" />,
    label: "探す",
    pageKey: "items",
    isCenter: false,
  },
  {
    href: "/pantry",
    icon: <TbFridge className="text-3xl" />,
    label: "レシピ",
    pageKey: "pantry",
    isCenter: true,
  },
  {
    href: "/me",
    icon: <CgProfile className="text-3xl" />,
    label: "プロフィール",
    pageKey: "profile",
    isCenter: false,
  },
];

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCenter: boolean;
}

function NavLink({ href, icon, label, isActive, isCenter }: NavLinkProps) {
  const baseClass = isCenter
    ? "-mt-5 flex h-18 w-18 flex-col items-center justify-center gap-1 rounded-full bg-purple-500 text-white shadow-lg transition-all duration-200"
    : `flex w-12 flex-col items-center justify-center gap-1 ${isActive ? "text-purple-500" : "text-gray-500"}`;

  return (
    <Link href={href} className={baseClass}>
      {icon}
      <span className="text-xs whitespace-nowrap">{label}</span>
    </Link>
  );
}

interface BottomNavigationProps {
  currentPage: (typeof navs)[number]["pageKey"];
}

function BottomNavigation({ currentPage }: BottomNavigationProps) {
  return (
    <nav
      className="glass fixed bottom-2 left-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 rounded-full p-3"
      role="navigation"
      aria-label="メインナビゲーション"
    >
      <ul className="flex w-full items-center justify-around">
        {navs.map((nav) => (
          <li key={nav.pageKey}>
            <NavLink
              href={nav.href}
              icon={nav.icon}
              label={nav.label}
              isActive={currentPage === nav.pageKey}
              isCenter={nav.isCenter}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { BottomNavigation };
