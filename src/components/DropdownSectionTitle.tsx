import type { ReactNode } from "react";

function DropdownSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 py-2 text-xs font-semibold text-neutral-400 tracking-wider uppercase">
      {children}
    </div>
  );
}

export default DropdownSectionTitle;
