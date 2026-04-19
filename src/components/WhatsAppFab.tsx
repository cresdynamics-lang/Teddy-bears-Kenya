import { whatsappLink } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-[#25D366] text-white shadow-glow hover:scale-105 transition-transform"
    >
      <span className="grid place-items-center w-7 h-7 rounded-full bg-white/20">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M20.52 3.48A11.94 11.94 0 0012.04 0C5.5 0 .2 5.3.2 11.84c0 2.08.55 4.12 1.6 5.92L0 24l6.4-1.68a11.83 11.83 0 005.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44z" />
        </svg>
      </span>
      <span className="hidden sm:inline text-sm font-semibold">Chat Now</span>
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
