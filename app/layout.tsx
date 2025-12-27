import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from "@/src/i18n/I18nProvider";
import LocaleSwitcher from "@/src/components/common/LocaleSwitcher";
import FooterLegalLinks from "@/src/components/common/FooterLegalLinks";

export const metadata: Metadata = {
  title: "Encoflow Digital Studio - AI-Powered Digital Creative Studio",
  description:
    "Building delightful apps and digital works with an AI-driven workflow—learning, sharing, and growing together.",
  keywords: "Encoflow, Digital Studio, AI, 3D Modeling, Game Development",
  authors: [{ name: "Encoflow Digital Studio" }],
  openGraph: {
    title: "Encoflow Digital Studio",
    description: "AI-powered digital creative studio",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <I18nProvider>
          {/* 动态背景 */}
          <div className="bg-animation" aria-hidden="true" />

          {/* 浮动光球 */}
          <div className="floating-orbs" aria-hidden="true">
            <div className="orb"></div>
            <div className="orb"></div>
            <div className="orb"></div>
          </div>

          <header className="site-header">
            <LocaleSwitcher />
          </header>

          {/* 主要内容 */}
          <main>{children}</main>
          <footer>
            <div className="footer-content">
              <FooterLegalLinks />
              <div className="footer-copyright">
                <div className="footer-contact">
                  <svg
                    className="footer-contact-icon"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8.5V17.5C4 18.8807 5.11929 20 6.5 20H17.5C18.8807 20 20 18.8807 20 17.5V8.5M4 8.5C4 7.11929 5.11929 6 6.5 6H17.5C18.8807 6 20 7.11929 20 8.5M4 8.5L12 13.5L20 8.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <a className="footer-contact-value" href="mailto:developers@encoflow.studio">
                    developers@encoflow.studio
                  </a>
                </div>
                <br />
                © 2025 Encoflow Digital Studio Sdn. Bhd.
              </div>
            </div>
          </footer>
        </I18nProvider>

      </body>
    </html>
  );
}
