import Link from "next/link";

export function Sidebar() {
  const menuItems = [
    { name: "Home", href: "/", icon: "📊" },
    { name: "Portfolio", href: "/portfolio", icon: "💼" },
    { name: "Analytics", href: "/analytics", icon: "📈" },
  ];

  return (
    <aside
      className="
      bg-bg-card border-t border-neutral-200 dark:border-neutral-800 
      w-full h-16 fixed bottom-0 left-0 z-30 
      flex row justify-around items-center px-4 transition-colors
      
      md:relative md:bottom-auto md:left-auto md:w-64 md:h-[calc(100vh-64px)] 
      md:flex-col md:justify-start md:items-stretch md:border-t-0 md:border-r md:p-4 
    "
    >
      <nav className="flex row w-full justify-around md:flex-col md:justify-start md:gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="
              flex items-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all font-medium
              flex-col text-[10px] gap-0.5 px-2 py-1
              md:flex-row md:text-sm md:gap-3 md:px-4 md:py-2.5
            "
          >
            <span className="text-lg md:text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
