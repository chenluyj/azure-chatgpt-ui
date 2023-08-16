import CN from "./cn";
import EN from "./en";
import TW from "./tw";
import ES from "./es";
import IT from "./it";

export type { LocaleType } from "./cn";

export const AllLangs = ["en", "cn", "tw", "es", "it"] as const;
type Lang = (typeof AllLangs)[number];

const LANG_KEY = "lang";

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    return "cn";
  }
}

export function getLang(): Lang {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  if (lang.includes("zh") || lang.includes("cn")) {
    return "cn";
  } else if (lang.includes("tw")) {
    return "tw";
  } else if (lang.includes("es")) {
    return "es";
  } else if (lang.includes("it")) {
    return "it";
  } else {
    return "en";
  }
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}

export default { en: EN, cn: CN, tw: TW, es: ES, it: IT }[getLang()];



const AITYPE_KEY = "aitype";
export const AllAitypes = ["gpt", "minimax"] as const;
type Aitype = (typeof AllAitypes)[number];
export function getAitype(): Aitype {
  const savedAitype = getItem(AITYPE_KEY);
  // console.log('getAitype: savedAitype = ', savedAitype)

  if (AllAitypes.includes((savedAitype ?? "gpt") as Aitype)) {
    return savedAitype as Aitype;
  }

  return 'gpt';
  
}

export function changeAitype(aitype: Aitype) {
  // console.log('changeAitype: aitype = ', aitype)
  setItem(AITYPE_KEY, aitype);
  location.reload();
}
