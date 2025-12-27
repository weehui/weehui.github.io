import { Metadata } from 'next';
import PailitiPageClient from './client';

export const metadata: Metadata = {
    title: '3D-PaiLiTi - Image to 3D Model in One Click | GLB/STL Export',
    description: '3D-PaiLiTi allows you to upload an image and generate a usable 3D model with one click, with WYSIWYG and support for GLB/STL export and online preview. Beginners can get started quickly.',
    robots: 'index,follow,max-image-preview:large',
    themeColor: '#667eea',
    openGraph: {
        type: 'website',
        siteName: '3D-PaiLiTi',
        title: '3D-PaiLiTi - Image to 3D Model in One Click',
        description: 'Upload Image → Generate 3D → Real-time Preview → Export GLB/STL.',
        url: 'https://encoflow.studio/3d-pailiti',
        images: [
            {
                url: 'https://encoflow.studio/images/3d-pailiti/og-cover.png',
                width: 1024,
                height: 1024,
                alt: '3D-PaiLiTi: One-click 3D model generation from images, with real-time preview and export',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '3D-PaiLiTi - Image to 3D Model in One Click',
        description: 'Upload Image → Generate 3D → Real-time Preview → Export GLB/STL.',
        images: ['https://encoflow.studio/images/3d-pailiti/og-cover.png'],
    },
};

export default function PailitiPage() {
    return <PailitiPageClient />;
}
