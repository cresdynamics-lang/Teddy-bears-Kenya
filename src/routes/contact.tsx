import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Teddy Bears Kenya" },
      { name: "description", content: "Get in touch with Teddy Bears Kenya. WhatsApp, call, or email — we reply fast. Westlands, Nairobi." },
      { property: "og:title", content: "Contact — Teddy Bears Kenya" },
      { property: "og:description", content: "WhatsApp, call, or email us. We reply fast." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi ${site.name}!\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(whatsappLink(msg), "_blank");
  };

  return (
    <>
      <section className="gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">Say hello</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Let's send a hug together.</h1>
          <p className="mt-3 text-muted-foreground">We reply within minutes on WhatsApp.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        {/* Info */}
        <div className="space-y-4">
          {[
            { icon: MapPin, label: "Visit us", value: site.address },
            { icon: Phone, label: "Call / WhatsApp", value: site.phone, href: whatsappLink() },
            { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
            { icon: Clock, label: "Hours", value: "Mon–Sat · 9:00–18:00" },
          ].map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href ?? "#"}
              {...(href ? { target: "_blank", rel: "noreferrer" } : {})}
              className="flex items-start gap-4 p-5 bg-card rounded-3xl shadow-soft hover:shadow-glow transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center text-primary shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            </a>
          ))}
          <div className="p-5 bg-secondary/40 rounded-3xl">
            <p className="text-sm font-semibold">🇰🇪 Delivery</p>
            <p className="text-sm text-muted-foreground mt-1">Nairobi same-day · Nationwide 1–3 days · M-Pesa, Card, Cash on Delivery.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-card rounded-[2rem] p-7 sm:p-9 shadow-soft space-y-4">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <p className="text-sm text-muted-foreground -mt-2">We'll open WhatsApp with your message ready to go.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium">Your name</label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 rounded-xl h-11" />
            </div>
            <div>
              <label className="text-xs font-medium">Email</label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 rounded-xl h-11" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Message</label>
            <Textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5 rounded-xl" placeholder="Tell us which bear, occasion, and delivery date…" />
          </div>
          <Button type="submit" className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Send via WhatsApp
          </Button>
        </form>
      </section>
    </>
  );
}
