export const LANGS = {
  en: { label: 'English', short: 'EN', og: 'en_US' },
  es: { label: 'Español', short: 'ES', og: 'es_ES' },
} as const;

export type Lang = keyof typeof LANGS;
export const DEFAULT_LANG: Lang = 'en';

const ui = {
  en: {
    'meta.title': 'Guillermo Riaño · Developer',
    'meta.description':
      "Guillermo Riaño's (DarkyGr) portfolio: software developer. Projects, social links and CV.",
    'a11y.skip': 'Skip to content',
    'a11y.langSwitch': 'Change language',
    'hero.greeting': "Hi! 👋 I'm Guillermo.",
    'hero.scroll': 'Scroll',
    'social.title': 'Social Networking Sites',
    'projects.title': 'Projects',
    'projects.noDescription': 'No description.',
    'projects.stars': 'stars',
    'projects.forks': 'forks',
    'exp.title': 'Education & Experience',
    'exp.none': "I don't have any",
    'exp.peepoFineAlt': 'Peepo waving with an "everything is fine" face',
    'exp.joke': "It's a joke!",
    'exp.moreInfo': "For more information about me, here's my CV:",
    'exp.cta': 'View CV',
    'exp.bye': "That's all. Have a great day, and may the Force be with you.",
    'exp.peepoByeAlt': 'Peepo waving goodbye',
    'footer.madeWith': 'Made with',
  },
  es: {
    'meta.title': 'Guillermo Riaño · Desarrollador',
    'meta.description':
      'Portafolio de Guillermo Riaño (DarkyGr): desarrollador de software. Proyectos, redes y CV.',
    'a11y.skip': 'Saltar al contenido',
    'a11y.langSwitch': 'Cambiar idioma',
    'hero.greeting': '¡Hola! 👋 Soy Guillermo.',
    'hero.scroll': 'Desliza',
    'social.title': 'Redes Sociales',
    'projects.title': 'Proyectos',
    'projects.noDescription': 'Sin descripción.',
    'projects.stars': 'estrellas',
    'projects.forks': 'forks',
    'exp.title': 'Educación y Experiencia',
    'exp.none': 'No tengo',
    'exp.peepoFineAlt': 'Peepo saludando con cara de "todo está bien"',
    'exp.joke': '¡Es broma!',
    'exp.moreInfo': 'Para más información sobre mí, aquí está mi CV:',
    'exp.cta': 'Ver CV',
    'exp.bye': 'Eso es todo. Que tengas un gran día y que la Fuerza te acompañe.',
    'exp.peepoByeAlt': 'Peepo despidiéndose con la mano',
    'footer.madeWith': 'Hecho con',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)['en'];

export function isLang(value: string | undefined): value is Lang {
  return !!value && value in LANGS;
}

export function useTranslations(lang: string | undefined) {
  const l: Lang = isLang(lang) ? lang : DEFAULT_LANG;
  return (key: UIKey): string => ui[l][key] ?? ui[DEFAULT_LANG][key];
}
