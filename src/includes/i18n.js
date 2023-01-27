import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import { createI18n } from "vue-i18n";

export default createI18n({
  locale: "en", // current language
  fallbackLocale: "en",
  messages: {
    en,
    fr,
  },
});
