import type { Metadata, Viewport } from "next";
import QueryProvider from "@/components/providers/QueryProvider";
import ServiceWorkerRegistration from "@/components/providers/ServiceWorkerRegistration";
import AppStartup from "@/components/providers/AppStartup";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NossoFUT",
    template: "%s | NossoFUT"
  },
  description: "Placares, jogos e futebol em tempo real.",
  applicationName: "NossoFUT",
  appleWebApp: {
    capable: true,
    title: "NossoFUT",
    statusBarStyle: "black-translucent"
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020817"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>{children}</QueryProvider>
        <AppStartup />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
