"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from '../AppPage.module.css';
import { Carousel } from '@/src/components/common/carousel';

export default function KoalaPageClient() {
    const t = useTranslations('koalaPage');
    const features = useTranslations('koalaPage.features');
    const users = useTranslations('koalaPage.users');

    const featureKeys = ['emotion_card', 'ai_chat', 'venting_hole', 'diary', 'ai_report', 'achievements'] as const;
    const userTags = users.raw('tags');

    const google_store_url = '#';
    const apple_store_url = '#';

    const carouselImages = Array.from({ length: 9 }, (_, i) => ({
        id: i,
        image: `/images/KoalaHaventree/${i}.jpg`,
        title: `Koala Haventree Screenshot ${i + 1}`,
    }));

    return (
        <div className={styles.container}>
            <div className={styles.hero} role="banner">
                <div className={styles.appIcon} aria-hidden="true">
                    <Image src="/images/KoalaHaventree/icon.jpeg" alt={t('title')} width="120" height="120" fetchPriority="high" />
                </div>

                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>

                { (google_store_url || apple_store_url) &&
                    <div className={styles.downloadButtons} aria-label="Download">
                        {google_store_url &&
                            <a className={styles.downloadBtn} href={google_store_url} target="_blank" rel="noopener noreferrer" aria-label="Download on Google Play">
                                <Image src="/images/button/google_store.png" alt="Get it on Google Play" width="512" height="153" loading="lazy" />
                            </a>
                        }
                        {apple_store_url &&
                            <a className={styles.downloadBtn} href={apple_store_url} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
                                <Image src="/images/button/apple_store.png" alt="Download on the App Store" width="512" height="153" loading="lazy" />
                            </a>
                        }
                    </div>
                }

                <div className={styles.screenshots}>
                    <Carousel
                        items={carouselImages}
                        autoPlay={true}
                        aspectRatio="9/16"
                        itemWidth={100}
                        showDots={true}
                    />
                </div>

                <div className={styles.features}>
                    {featureKeys.map(key => (
                        <div key={key} className={styles.featureCard}>
                            <div className={styles.featureIcon} aria-hidden="true">{features(`items.${key}.icon`)}</div>
                            <div className={styles.featureTitle}>{features(`items.${key}.title`)}</div>
                            <div className={styles.featureDesc}>{features(`items.${key}.description`)}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.usersSection}>
                    <h2 className={styles.sectionTitle}>{users('title')}</h2>
                    <div className={styles.userTags} role="list">
                        {userTags.map((tag: { title: string; icon: string }) => (
                            <div key={tag.title} className={styles.userTag} role="listitem">{tag.icon} {tag.title}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
