import { db } from "~/server/db"
import { MapPin, Phone, Mail } from "lucide-react"

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const contact = await db.query.settings.findFirst();
  const contactPhone = contact?.contactPhone ?? "Not set";
  const contactEmail = contact?.contactEmail ?? "Not set";
  const mapUrl = contact?.mapUrl ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108427.09118506256!2d35.84594689617267!3d31.95468758652011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca073b9e4b7b3%3A0x6bba2e951be19e7e!2sAmman%2C%20Jordan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-20 text-center flex flex-col items-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-white leading-none">
          Contact <span className="text-primary italic">Us</span>
        </h1>
        <p className="text-white/60 text-xl font-medium max-w-2xl leading-relaxed">
          We&apos;d love to hear from you. Find our location in the heart of Amman or get in touch below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-8 glass-dark p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-3xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-8">Get In Touch</h2>
          

          <div className="flex items-center gap-6 group">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 transition-colors group-hover:bg-primary/20">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-primary/60">Address</p>
              <p className="text-lg font-bold text-white">Amman, Jordan, 7th Circle</p>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 transition-colors group-hover:bg-primary/20">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-primary/60">Phone</p>
              <p className="text-lg font-bold text-white tracking-widest">{contactPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 transition-colors group-hover:bg-primary/20">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-primary/60">Email</p>
              <p className="text-lg font-bold text-white">{contactEmail}</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="h-full min-h-[400px] w-full rounded-3xl overflow-hidden glass dark:glass-dark p-2 border border-white/10">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "1.2rem" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Barber Shop Location in Amman"
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  )
}
