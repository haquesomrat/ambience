import type { Metadata } from "next";
import localfont from "next/font/local";
// import image from "/public/og-image.png";
import Nav from "@/components/frontend/nav";
import ScrollToTop from "@/components/frontend/scrollToTop";
import Footer from "@/components/frontend/footer";

const dipotic = localfont({
  src: [
    {
      path: "../../assets/fonts/dipotic/Didot-Italic.otf",
    },
  ],
  variable: "--font-dipotic",
});
const openSans = localfont({
  src: [
    {
      path: "../../assets/fonts/open-sans/OpenSans-VariableFont_wdth,wght.ttf",
    },
  ],
  variable: "--font-openSans",
});
const palatino = localfont({
  src: [
    {
      path: "../../assets/fonts/palatino/Palatino LT Bold.ttf",
    },
  ],
  variable: "--font-palatino",
});

export const metadata: Metadata = {
  //   metadataBase: new URL(process.env.NEXTAUTH_URL || ""),
  title: {
    default: "Home - Ambiance",
    template: "%s - Ambiance",
  },
  description: "The Interior Design",
  //   openGraph: {
  //     title: "Ambiance",
  //     images: [{ url: image.src }],
  //   },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${dipotic.variable} ${openSans.variable} ${palatino.variable}`}
    >
      <Nav />
      {children}
      <ScrollToTop />
      <Footer />
    </div>
  );
}
