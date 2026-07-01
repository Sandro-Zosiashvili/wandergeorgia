import { site, whatsappLink } from '@/config/site';
import Container from '@/components/ui/Container/Container';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import Reveal from '@/components/ui/Reveal/Reveal';
import styles from './CTABand.module.scss';

/** "Plan your trip" call-to-action band, also the #contact anchor target. */
export default function CTABand() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="cta-title">
      <Container>
        <Reveal from="up">
          <div className={styles.band}>
            <div className={styles.glow} aria-hidden="true" />

            <div className={styles.content}>
              <span className={styles.eyebrow}>
                <Icon name="compass" size={16} />
                Let&apos;s plan something unforgettable
              </span>
              <h2 id="cta-title" className={styles.title}>
                Your Georgia, <em>designed around you</em>.
              </h2>
              <p className={styles.text}>
                Tell us your dates and what you dream of seeing. We&apos;ll craft a
                private itinerary — airport transfers included — and have you
                exploring within days.
              </p>

              <div className={styles.actions}>
                <Button href="/#packages" size="lg" icon="arrow-right">
                  Start planning
                </Button>
                <Button
                  href={whatsappLink()}
                  external
                  size="lg"
                  variant="outline"
                  icon="whatsapp"
                  iconLeading
                >
                  Chat on WhatsApp
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
