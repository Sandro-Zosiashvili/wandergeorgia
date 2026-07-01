import Container from '@/components/ui/Container/Container';
import Button from '@/components/ui/Button/Button';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Container size="narrow">
        <div className={styles.inner}>
          <span className={styles.code}>404</span>
          <h1 className={styles.title}>This trail leads nowhere</h1>
          <p className={styles.text}>
            The page you&apos;re looking for has wandered off. Let&apos;s get you
            back to the journey.
          </p>
          <div className={styles.actions}>
            <Button href="/" icon="arrow-right">
              Back to home
            </Button>
            <Button href="/#day-tours" variant="outline">
              Browse tours
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
