import type {Metadata, Viewport} from 'next';
import {Fraunces, Manrope} from 'next/font/google';
import {site} from '@/config/site';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import WhatsAppButton from '@/components/whatsapp/WhatsAppButton/WhatsAppButton';
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
    metadataBase: new URL(site.url),
    title: {
        default: `${site.name} — ${site.tagline}`,
        template: `%s · ${site.name}`,
    },
    description: site.description,
    keywords: [
        'Georgia tours',
        'travel to Georgia',
        'private tours Georgia',
        'Tbilisi tours',
        'Kazbegi',
        'Kakheti wine tours',
        'Caucasus travel',
    ],
    openGraph: {
        siteName: "WanderGeorgia",
        images: ["/assets/icons/gramp-image-2.png"],
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
        <Header/>
        <main id="main">{children}</main>
        <Footer/>
        <WhatsAppButton/>
        </body>
        </html>
    );
}
