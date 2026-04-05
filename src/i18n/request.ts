import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import { db } from '~/server/db';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  if (!locale || !routing.locales.includes(locale as "en" | "ar")) {
    locale = routing.defaultLocale;
  }

  // Load static JSON messages
  const jsonMessages = (await import(`../../messages/${locale}.json`)) as { default: Record<string, unknown> };
  
  // Load dynamic DB translations
  const dbTranslations = await db.query.translations.findMany();
  
  // Merge: DB overrides JSON
  const messages = JSON.parse(JSON.stringify(jsonMessages.default)) as Record<string, any>;
  
  for (const trans of dbTranslations) {
    const value = locale === 'ar' ? trans.ar : trans.en;
    if (value) {
      const keys = trans.key.split('.');
      let current = messages;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i]!;
        if (!current[k]) current[k] = {};
        current = current[k] as Record<string, any>;
      }
      current[keys[keys.length - 1]!] = value;
    }
  }

  return {
    locale,
    messages
  };
});
