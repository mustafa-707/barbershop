import { db } from "~/server/db";
import { SettingsForm } from "./_components/settings-form";
import { getTranslations } from "next-intl/server";

export default async function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations('Admin');
  const settings = await db.query.settings.findFirst();

  return (
    <div className="space-y-10">
      <div className="bg-white/5 dark:bg-black/20 p-8 rounded-[2rem] border border-white/10 glass shadow-xl">
        <h1 className="text-4xl font-black tracking-tight">{t('settingsTitle')}</h1>
        <p className="text-muted-foreground text-lg">{t('settingsDesc')}</p>
      </div>
      <SettingsForm initialData={settings} />
    </div>
  );
}
