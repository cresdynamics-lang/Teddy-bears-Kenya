import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Heart } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-24 bg-cocoa text-cream">
      {/* Mt. Kenya silhouette */}
      <svg
        className="absolute -top-px left-0 right-0 w-full text-cocoa"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,80 L120,60 L240,90 L360,40 L480,75 L560,30 L640,70 L720,20 L800,65 L900,45 L1020,85 L1140,55 L1260,90 L1380,65 L1440,80 L1440,120 L0,120 Z"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
                <Heart className="w-4 h-4 fill-current" />
              </span>
              {site.name}
            </div>
            <p className="mt-3 text-sm text-cream/80">{site.tagline}</p>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link to="/shop" search={{ category: "Small" }} className="hover:text-primary">Small Bears</Link></li>
              <li><Link to="/shop" search={{ category: "Medium" }} className="hover:text-primary">Medium Bears</Link></li>
              <li><Link to="/shop" search={{ category: "Giant" }} className="hover:text-primary">Giant Bears</Link></li>
              <li><Link to="/shop" search={{ category: "Personalized" }} className="hover:text-primary">Personalized</Link></li>
              <li><Link to="/shop" search={{ category: "Gift Sets" }} className="hover:text-primary">Gift Sets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> {site.address}</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /> {site.phone}</li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /> {site.email}</li>
            </ul>
            <p className="mt-3 text-xs text-cream/60">Nairobi same-day · Nationwide 1–3 days</p>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold mb-3">Follow</h4>
            <div className="flex gap-2">
              <a href="https://instagram.com" aria-label="Instagram" className="p-2 rounded-full bg-cream/10 hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="https://facebook.com" aria-label="Facebook" className="p-2 rounded-full bg-cream/10 hover:bg-primary hover:text-primary-foreground transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href={whatsappLink()} aria-label="WhatsApp" className="p-2 rounded-full bg-cream/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.52 3.48A11.94 11.94 0 0012.04 0C5.5 0 .2 5.3.2 11.84c0 2.08.55 4.12 1.6 5.92L0 24l6.4-1.68a11.83 11.83 0 005.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44zM12.05 21.5h-.01a9.66 9.66 0 01-4.92-1.35l-.35-.21-3.8 1 1.02-3.7-.23-.38a9.65 9.65 0 01-1.49-5.13c0-5.34 4.35-9.68 9.7-9.68 2.59 0 5.02 1.01 6.85 2.84a9.62 9.62 0 012.84 6.86c0 5.34-4.35 9.68-9.6 9.68zm5.31-7.25c-.29-.15-1.71-.84-1.97-.94-.27-.1-.46-.15-.65.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.62.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.49-.65-.5h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.02 2.82 1.17 3.02c.15.19 2.02 3.08 4.89 4.32.68.29 1.21.46 1.63.59.69.22 1.31.19 1.8.12.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/></svg>
              </a>
            </div>
            <p className="mt-4 text-xs text-cream/60">© {new Date().getFullYear()} {site.name}. Made with 💕 in Nairobi.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
