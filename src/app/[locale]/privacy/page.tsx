import { Shield } from "lucide-react";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container mx-auto max-w-4xl py-24 px-6 relative z-10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <div className="p-5 bg-primary/10 rounded-3xl mb-6 shadow-xl">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-4 text-foreground">
          {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          {locale === 'ar' ? 'نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.' : 'We respect your privacy and are committed to protecting your personal data.'}
        </p>
      </div>

      <div className="space-y-12 glass dark:glass-dark p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <section className="space-y-6 relative z-10">
          <h2 className="text-3xl font-black text-primary">
            {locale === 'ar' ? '1. جمع المعلومات' : '1. Information Collection'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {locale === 'ar' 
              ? 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند حجز موعد أو إنشاء حساب أو التواصل معنا. قد يشمل ذلك اسمك ورقم هاتفك وعنوان بريدك الإلكتروني.'
              : 'We collect information you provide directly to us when you book an appointment, create an account, or communicate with us. This may include your name, phone number, and email address.'}
          </p>
        </section>

        <section className="space-y-6 relative z-10">
          <h2 className="text-3xl font-black text-primary">
             {locale === 'ar' ? '2. استخدام المعلومات' : '2. Information Usage'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
             {locale === 'ar' 
              ? 'نستخدم المعلومات لتقديم خدماتنا وتحسينها وتخصيص تجربتك، ولمراسلتك بخصوص الحجوزات والعروض الخاصة التي قد تهمك.'
              : 'We use the information to provide, improve, and personalize our services, and to communicate with you regarding appointments and special offers.'}
          </p>
        </section>

        <section className="space-y-6 relative z-10">
          <h2 className="text-3xl font-black text-primary">
             {locale === 'ar' ? '3. حماية البيانات' : '3. Data Security'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
             {locale === 'ar' 
              ? 'نتخذ تدابير أمنية متقدمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو إفشائها للمنظمات الخارجية.'
              : 'We implement advanced security measures to protect your personal information from unauthorized access, alteration, or disclosure to external organizations.'}
          </p>
        </section>
      </div>
    </div>
  );
}
