"use client";

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';

import CarouselExample from '@/src/components/CarouselWithSidebar';
import styles from './page.module.css';

export default function Page() {
  const t = useTranslations('home');
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  useEffect(() => {
    const finishLoading = () => setIsLoading(false);
    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading, { once: true });
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY});
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('load', finishLoading);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.featureCard}`);
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = ((mousePosition.x - rect.left) / rect.width) * 100;
      const y = ((mousePosition.y - rect.top) / rect.height) * 100;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}%`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}%`);
    });
  }, [mousePosition]);

  return (
    <>
      {isLoading && (
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      )}

      <div
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          opacity: isLoading ? 0 : 1
        }}
      />

      <h1 className={styles.heroTitle}>{t('heroTitle')}</h1>

      <CarouselExample />

      <div className={styles.card_container}>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              🚀
            </div>
            <div className={styles.featureTitle}>{t('features.innovation.title')}</div>
            <div className={styles.featureDesc}>{t('features.innovation.desc')}</div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              🎨
            </div>
            <div className={styles.featureTitle}>{t('features.design.title')}</div>
            <div className={styles.featureDesc}>{t('features.design.desc')}</div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              🌟
            </div>
            <div className={styles.featureTitle}>{t('features.quality.title')}</div>
            <div className={styles.featureDesc}>{t('features.quality.desc')}</div>
          </div>
        </div>
      </div>
    </>
  );
}
