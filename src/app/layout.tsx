import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Restreamer",
  description: "Restreamer - Video-Streaming",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0b1118",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div id="root">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
