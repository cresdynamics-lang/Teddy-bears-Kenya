import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart";
import { Layout } from "@/components/Layout";
import { Link } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <Layout>
      <div className="min-h-[60vh] grid place-items-center px-4 text-center">
        <div>
          <p className="font-display text-7xl font-bold text-primary">404</p>
          <h1 className="mt-3 font-display text-2xl">This bear has wandered off</h1>
          <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:bg-primary/90">
            Take me home
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Teddy Bears Kenya — Hugs in Every Bear" },
      { name: "description", content: "Buy adorable teddy bears in Nairobi, Kenya. Same-day delivery, M-Pesa accepted. Personalised, giant & gift-set bears." },
      { name: "keywords", content: "teddy bears Nairobi, buy teddy bears Kenya, gift shop Kenya, valentine teddy Nairobi" },
      { name: "author", content: "Teddy Bears Kenya" },
      { property: "og:title", content: "Teddy Bears Kenya — Hugs in Every Bear" },
      { property: "og:description", content: "Kenya's #1 teddy gift shop. Same-day Nairobi delivery, M-Pesa accepted." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Nunito:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <CartProvider>
      <Layout>
        <Outlet />
      </Layout>
    </CartProvider>
  );
}
