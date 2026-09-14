import Link from "next/link";
import type { ReactNode } from "react";

interface DropdownItemProps {
  icon: string;
  title: string;
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const baseClass =
  "flex items-center justify-between gap-3 px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 w-full text-left transition-colors";

function DropdownItem({
  icon,
  title,
  href,
  onClick,
  children,
}: DropdownItemProps) {
  const content = (
    <>
      <span className="flex items-center gap-3 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{title}</span>
      </span>
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClass} cursor-pointer`}>
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClass} cursor-pointer`}>
        {content}
      </button>
    );
  }
  return <div className={baseClass}>{content}</div>;
}

export default DropdownItem;
