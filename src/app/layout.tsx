import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata = {
  title: "SoInBae",
  description: "전남대학교 인공지능학부 동아리 AIM 소인배 팀 소개 사이트",
  icons: {
    icon: "/logo.svg",
  },
  author: "김도형",
  openGraph: {
    type: "website",
    url: "https://soinbae.dohyeong1203.com",
    title: "SoInBae",
    description: "전남대학교 인공지능학부 동아리 AIM 소인배 팀 소개 사이트",
    images: [
      {
        url: "/soinbae.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoInBae",
    description: "전남대학교 인공지능학부 동아리 AIM 소인배 팀 소개 사이트",
    images: ["/soinbae.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
