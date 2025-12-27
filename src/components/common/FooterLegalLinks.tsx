"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function FooterLegalLinks() {
  const pathname = usePathname();
  const isPailiti = pathname.startsWith("/3d-pailiti");
  const isKoala = pathname.startsWith("/koala-haventree");
  const show = isPailiti || isKoala;
  const t = useTranslations("footer");

  if (!show) return null;

  const basePath = isKoala ? "/koala-haventree" : "/3d-pailiti";

  return (
    <div className="footer-links" aria-label="Legal links">
      <a
        className="footer-link"
        href={`${basePath}/privacy`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("privacyPolicy")}
      </a>
      <a
        className="footer-link"
        href={`${basePath}/terms`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("termsOfService")}
      </a>
    </div>
  );
}
