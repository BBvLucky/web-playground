import { type NextRequest } from "next/server";
import { createProxy } from "next-i18next/proxy";
import { updateSession } from "@/utils/supabase/middleware";

import i18nConfig from "./i18n.config";

const i18nProxy = createProxy(i18nConfig);

export async function proxy(request: NextRequest) {
  const i18nResponse = await i18nProxy(request);

  return await updateSession(request, i18nResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
