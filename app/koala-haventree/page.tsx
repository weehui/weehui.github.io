import { Metadata } from 'next';
import KoalaPageClient from './client';

export const metadata: Metadata = {
    title: 'Koala Haventree - Your Cozy Digital Sanctuary',
    description: 'Koala Haventree is a unique mobile game that provides a tranquil and comforting space for relaxation and self-reflection. Find moments of peace and mindfulness.',
    robots: 'index,follow,max-image-preview:large',
    themeColor: '#667eea',
    openGraph: {
        type: 'website',
        siteName: 'Koala Haventree',
        title: 'Koala Haventree - Your Cozy Digital Sanctuary',
        description: 'Grow emotion trees, interact with creatures, and create your personalized haven.',
        url: 'https://encoflow.studio/koala-haventree',
        images: [
            {
                url: 'https://encoflow.studio/images/KoalaHaventree/og-cover.png',
                width: 1024,
                height: 1024,
                alt: 'Koala Haventree: A cozy game for relaxation and mindfulness.',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Koala Haventree - Your Cozy Digital Sanctuary',
        description: 'Grow emotion trees, interact with creatures, and create your personalized haven.',
        images: ['https://encoflow.studio/images/KoalaHaventree/og-cover.png'],
    },
};

export default function KoalaPage() {
    return <KoalaPageClient />;
}
