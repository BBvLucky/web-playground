"use client";

import { useChangeLanguage } from "next-i18next/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function DropdownLangSwitcher() {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const changeLang = useChangeLanguage();

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLang(e.target.value);
    setSelectedLang(e.target.value);
  };

  return (
    <select
      className="bg-background border border-neutral-300 dark:border-neutral-800 text-xs rounded px-1.5 py-0.5 focus:outline-none"
      id="switchLang"
      value={selectedLang}
      onChange={handleChangeLang}
    >
      <option value="ru">Русский</option>
      <option value="en">English</option>
    </select>
  );
}

export default DropdownLangSwitcher;
