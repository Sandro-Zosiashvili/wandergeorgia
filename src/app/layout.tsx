import type {Metadata, Viewport} from 'next';
import {Fraunces, Manrope} from 'next/font/google';
import {site} from '@/config/site';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import WhatsAppButton from '@/components/whatsapp/WhatsAppButton/WhatsAppButton';
import ScrollManager from '@/components/layout/ScrollManager/ScrollManager';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structuredData';
import './globals.scss';


const display = Fraunces({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    style: ['normal', 'italic'],
    variable: '--font-display',
    display: 'swap',
});

// Clean, warm geometric sans for body and UI.
const sans = Manrope({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL("https://wanderkartli.com"),
    title: {
        default: `${site.name} — ${site.tagline}`,
        template: `%s · ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    alternates: {
        canonical: '/',
    },
    keywords: [
        'Georgia tours',
        'travel to Georgia',
        'private tours Georgia',
        'Georgia tour packages',
        'Tbilisi tours',
        'day tours from Tbilisi',
        'Kazbegi tour',
        'Gudauri tours',
        'Kakheti wine tours',
        'Svaneti tours',
        'Batumi tours',
        'Borjomi tours',
        'Caucasus travel',
        'Caucasus mountains tours',
        'private guide Georgia',
        'things to do in Georgia',
        'Georgia travel itinerary',
        'airport transfer Tbilisi',
        'Georgia vacation',
        'guided tours Georgia country',
    ],
    verification: {
        google: "jZb3DC8tTWQpZP0AsTPbFX5rxW1X2jB2GyQQQ17oYrQ",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        url: '/',
        siteName: "WanderKartli",
        locale: 'en_US',
        title: `${site.name} — ${site.tagline}`,
        description: site.description,
        images: [
            {
                url: "/assets/icons/gramp-image.png",
                width: 1200,
                height: 630,
                alt: 'WanderKartli — private tours across Georgia',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${site.name} — ${site.tagline}`,
        description: site.description,
        images: ['/assets/icons/gramp-image.png'],
    },
};

export const viewport: Viewport = {
    themeColor: '#0a0908',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${display.variable} ${sans.variable}`}>
        <body>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <ScrollManager/>
        <Header/>
        <main id="main">{children}</main>
        <Footer/>
        <WhatsAppButton/>
        </body>
        </html>
    );
}
