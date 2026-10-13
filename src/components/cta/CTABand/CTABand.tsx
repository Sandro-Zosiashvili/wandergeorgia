import { site, whatsappLink } from '@/config/site';
import type { Locale } from '@/lib/locale';
import Container from '@/components/ui/Container/Container';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import Reveal from '@/components/ui/Reveal/Reveal';
import { ui } from '@/lib/uiStrings';
import { emphasize } from '@/lib/emphasize';
import styles from './CTABand.module.scss';

/** "Plan your trip" call-to-action band, also the #contact anchor target. */
export default function CTABand({ lang }: { lang: Locale }) {
  const t = ui(lang).home.cta;
  return (
    <section id="contact" className={styles.section} aria-labelledby="cta-title">
      <Container>
        <Reveal from="up">
          <div className={styles.band}>
            <div className={styles.glow} aria-hidden="true" />

            <div className={styles.content}>
              <span className={styles.eyebrow}>
                <Icon name="compass" size={16} />
                {t.eyebrow}
              </span>
              <h2 id="cta-title" className={styles.title}>
                {emphasize(t.title)}
              </h2>
              <p className={styles.text}>{t.text}</p>

              <div className={styles.actions}>
                <Button href="/#packages" size="lg" icon="arrow-right">
                  {t.startPlanning}
                </Button>
                <Button
                  href={whatsappLink()}
                  external
                  size="lg"
                  variant="outline"
                  icon="whatsapp"
                  iconLeading
                >
                  {t.whatsapp}
                </Button>
              </div>

              <div className={styles.contacts}>
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className={styles.contact}>
                  <Icon name="phone" size={17} />
                  {site.contact.phone}
                </a>
                <a href={`mailto:${site.contact.email}`} className={styles.contact}>
                  <Icon name="mail" size={17} />
                  {site.contact.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
