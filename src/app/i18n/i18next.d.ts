import "@/i18n.config";
import common from "./locales/en/common.json";
import authorization from "./locales/en/authorization.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      authorization: typeof authorization; // registration uses same structure as common
    };
  }
}
