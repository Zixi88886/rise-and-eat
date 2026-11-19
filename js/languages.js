// The languages the Settings window offers, and the page class each one sets.
// A choice is English alone, one other language alone, or English with one other language under it.

export const LANGUAGE_CHOICES = [
  { code: 'en', name: 'English', nameLanguage: null, detail: 'English only' },
  { code: 'zh', name: '中文', nameLanguage: 'zh-Hans', detail: 'Chinese only' },
  { code: 'fr', name: 'Français', nameLanguage: 'fr', detail: 'French only' },
  { code: 'both', name: 'English + 中文', nameLanguage: 'zh-Hans', detail: 'English and Chinese' },
  { code: 'en-fr', name: 'English + Français', nameLanguage: 'fr', detail: 'English and French' },
];

// The class put on the page for the chosen language. English only hides every other language;
// a language alone hides the English that has a translation; English with Chinese (the default) hides
// nothing but the French; English with French hides the Chinese. An unknown choice changes nothing.
export function languageClass(language) {
  switch (language) {
    case 'en': return 'only-english';
    case 'zh': return 'only-chinese';
    case 'fr': return 'only-french';
    case 'en-fr': return 'with-french';
    default: return '';
  }
}
