import { whyChooseUs } from '@/data/whyChooseUs';
import Container from '@/components/ui/Container/Container';
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading';
import Reveal from '@/components/ui/Reveal/Reveal';
import TrustCard from '../TrustCard/TrustCard';
import StatsStrip from '../StatsStrip/StatsStrip';
import styles from './WhyChooseUs.module.scss';

/** "Why Choose Us" trust section: reason cards + a headline stats strip. */
export default function WhyChooseUs() {
  return (
    <section id="why-us" className={styles.section} aria-labelledby="why-us-title">
      <Container>
        <SectionHeading
          eyebrow="Why WanderGeorgia"
          title={
            <span id="why-us-title">
              Premium, personal, <em>and effortless</em>
            </span>
          }
          description="From your arrival gate to your final farewell, everything is handled with care. This is travel the way it should feel — private, considered and calm."
        />

        <div className={styles.grid}>
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} from="up" delay={i * 0.07}>
              <TrustCard item={item} />
            </Reveal>
          ))}
        </div>

        <StatsStrip />
      </Container>
    </section>
  );
}
