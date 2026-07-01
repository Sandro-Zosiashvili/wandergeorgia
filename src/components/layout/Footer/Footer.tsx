import Link from 'next/link';
import { site } from '@/config/site';
import { navItems } from '@/config/navigation';
import { oneDayTours } from '@/data/tours';
import Logo from '../Logo/Logo';
import Icon, { type IconName } from '@/components/ui/Icon/Icon';
import styles from './Footer.module.scss';

const socialLinks: { name: string; icon: IconName; href: string }[] = [
  { name: 'Instagram', icon: 'instagram', href: site.socials.instagram },
  { name: 'Facebook', icon: 'facebook', href: site.socials.facebook },
  { name: 'TripAdvisor', icon: 'globe', href: site.socials.tripadvisor },
  { name: 'YouTube', icon: 'youtube', href: site.socials.youtube },
];

/** Site footer: brand, navigation, popular tours, contact and socials. */
export default function Footer() {
  const year = new Date().getFullYear();
  const popular = oneDayTours.slice(0, 4);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Logo />
          <p className={styles.blurb}>{site.description}</p>
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

        <nav className={styles.col} aria-label="Footer">
          <h3 className={styles.colTitle}>Explore</h3>
          <ul className={styles.linkList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Popular tours">
          <h3 className={styles.colTitle}>Popular tours</h3>
          <ul className={styles.linkList}>
            {popular.map((tour) => (
              <li key={tour.slug}>
                <Link href={`/tours/${tour.slug}`} className={styles.link}>
                  {tour.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Get in touch</h3>
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
          © {year} {site.name}. Private tours across Georgia.
        </p>
        <p className={styles.finePrint}>
          Airport pickup &amp; drop-off included with every journey.
        </p>
      </div>
    </footer>
  );
}
