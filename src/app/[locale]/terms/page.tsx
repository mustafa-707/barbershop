import { FileText } from "lucide-react";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container mx-auto max-w-4xl py-24 px-6 relative z-10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <div className="p-5 bg-primary/10 rounded-3xl mb-6 shadow-xl">
          <FileText className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-4 text-foreground">
           {locale === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
           {locale === 'ar' ? 'يرجى قراءة هذه الشروط بعناية قبل استخدام خدمات صالون الحلاقة.' : 'Please read these terms carefully before using our barbershop services.'}
        </p>
      </div>

      <div className="space-y-12 glass dark:glass-dark p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <section className="space-y-6 relative z-10">
          <h2 className="text-3xl font-black text-primary">
             {locale === 'ar' ? '1. سياسة الحجز' : '1. Booking Policy'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
             {locale === 'ar' 
              ? 'عند حجز موعد، فإنك توافق على الالتزام بالوقت المحدد. يرجى إشعارنا قبل 24 ساعة على الأقل إذا كنت بحاجة إلى تغيير أو إلغاء حجزك لتجنب أي رسوم.'
              : 'By booking an appointment, you agree to adhere to the scheduled time. Please notify us at least 24 hours in advance if you need to reschedule or cancel to avoid any fees.'}
          </p>
        </section>

        <section className="space-y-6 relative z-10">
          <h2 className="text-3xl font-black text-primary">
             {locale === 'ar' ? '2. الخدمات ومشتريات المنتجات' : '2. Services and Product Purchases'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
             {locale === 'ar' 
              ? 'نحن نضمن جودة خدماتنا ومنتجاتنا. في حالة عدم الرضا، يجب إبلاغ فريقنا فورًا في الصالون لضمان المراجعة والتعديل حسب الضرورة.'
              : 'We guarantee the quality of our services and products. If unsatisfied, you must inform our team immediately at the shop to ensure resolution and necessary adjustments.'}
          </p>
        </section>

        <section className="space-y-6 relative z-10">
          <h2 className="text-3xl font-black text-primary">
             {locale === 'ar' ? '3. السلوك' : '3. Code of Conduct'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
             {locale === 'ar' 
              ? 'نحتفظ بالحق في رفض الخدمة لأي شخص ينتهك السلوك العام أو يظهر سلوكيات غير مهنية في جميع فروعنا.'
              : 'We reserve the right to refuse service to anyone violating general etiquette or displaying unprofessional behaviors in any of our branches.'}
          </p>
        </section>
      </div>
    </div>
  );
}
