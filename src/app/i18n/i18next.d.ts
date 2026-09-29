import "@/i18n.config";
import common from "./locales/en/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
    };
  }
}
