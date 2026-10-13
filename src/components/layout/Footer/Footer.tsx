'use client';

import { usePathname } from 'next/navigation';
import LocaleLink from '@/components/ui/LocaleLink/LocaleLink';
import { site } from '@/config/site';
import { navItems } from '@/config/navigation';
import { useLocale } from '@/hooks/useLocale';
import { ui } from '@/lib/uiStrings';
import Logo from '../Logo/Logo';
import Icon, { type IconName } from '@/components/ui/Icon/Icon';
import styles from './Footer.module.scss';

const socialLinks: { name: string; icon: IconName; href: string }[] = [
  { name: 'Instagram', icon: 'instagram', href: site.socials.instagram },
  { name: 'Facebook', icon: 'facebook', href: site.socials.facebook },
  { name: 'TripAdvisor', icon: 'globe', href: site.socials.tripadvisor },
  { name: 'YouTube', icon: 'youtube', href: site.socials.youtube },
];

interface FooterProps {
  /** Popular tours to link (slug + title) — provided from the DB by the layout. */
  popular: { slug: string; title: string }[];
}

/** Site footer: brand, navigation, popular tours, contact and socials. */
export default function Footer({ popular }: FooterProps) {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const locale = useLocale();
  const t = ui(locale);
  const f = t.footer;

  // The /admin area has its own chrome — no public footer there.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Logo />
          <p className={styles.blurb}>{f.blurb}</p>
          <ul className={styles.socials}>
            {socialLinks.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className={styles.social}
                >
                  <Icon name={s.icon} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className={styles.col} aria-label={f.explore}>
          <h3 className={styles.colTitle}>{f.explore}</h3>
          <ul className={styles.linkList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <LocaleLink href={item.href} className={styles.link}>
                  {t.nav[item.key] ?? item.label}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label={f.popularTours}>
          <h3 className={styles.colTitle}>{f.popularTours}</h3>
          <ul className={styles.linkList}>
            {popular.map((tour) => (
              <li key={tour.slug}>
                <LocaleLink href={`/tours/${tour.slug}`} className={styles.link}>
                  {tour.title}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>{f.getInTouch}</h3>
          <ul className={styles.contactList}>
            <li>
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className={styles.contactItem}>
                <Icon name="phone" size={17} />
                <span>{site.contact.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className={styles.contactItem}>
                <Icon name="mail" size={17} />
                <span>{site.contact.email}</span>
              </a>
            </li>
            <li>
              <span className={styles.contactItem}>
                <Icon name="map-pin" size={17} />
                <span>{site.contact.address}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © {year} {site.name}. {f.rights}
        </p>
        <p className={styles.finePrint}>{f.transfers}</p>
      </div>
    </footer>
  );
}
