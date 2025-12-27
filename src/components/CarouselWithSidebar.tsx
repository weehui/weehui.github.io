import React from 'react';
import {useTranslations} from 'next-intl';
import { useRouter } from 'next/navigation';

import CarouselWithSidebar, { GameItem } from './common/CarouselWithSidebar';

export default function Carousel() {
    const t = useTranslations('carousel');
    const router = useRouter();

    // 示例数据
    const games: GameItem[] = [
        {
            id: '3d-pailiti',
            path: '/3d-pailiti',
            title: t('items.pailiti.title'),
            image: '/images/3d-pailiti/3d-pailiti-4.jpg',
            thumbnailImage: '/images/3d-pailiti/icon.png',
            subtitle: t('items.pailiti.subtitle'),
            description: t('items.pailiti.description'),
            logo: '/images/logo1.png',
            google_store_url: 'https://play.google.com/store/apps/details?id=com.encoflow.EDS202501',
            apple_store_url: 'https://apps.apple.com/us/app/3d-pailiti/id6755151130',
        },
        {
            id: 'koala-haventree',
            path: '/koala-haventree',
            title: t('items.koala.title'),
            image: '/images/KoalaHaventree/preview.jpg',
            thumbnailImage: '/images/KoalaHaventree/icon.jpeg',
            logo: '',
            subtitle: t('items.koala.subtitle'),
            description: t('items.koala.description'),
            google_store_url: '',
            apple_store_url: '',
        },
    ];

    const handleGameClick = (game: GameItem, index: number) => {
        console.log('Game clicked:', game, 'at index:', index);
        if (game.path) {
            router.push(game.path);
        }
    };

    return (
        <div style={{ padding: '20px', marginTop: '20px' }}>
            <CarouselWithSidebar
                games={games}
                autoPlay={true}
                autoPlayInterval={6000}
                onItemClick={handleGameClick}
            />
        </div>
    );
}
