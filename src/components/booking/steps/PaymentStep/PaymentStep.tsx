import { formatGEL } from '@/lib/format';
import StepShell from '../../StepShell/StepShell';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { site, whatsappLink } from '@/config/site';
import styles from './PaymentStep.module.scss';

interface PaymentStepProps {
  total: number;
  isComplete: boolean;
  onComplete: () => void;
}

/**
 * Final step — UI stops here on purpose. "Continue to payment" simulates the
 * hand-off to a real gateway (Stripe / Georgian bank), which is wired up later.
 */
export default function PaymentStep({ total, isComplete, onComplete }: PaymentStepProps) {
  if (isComplete) {
    return (
      <StepShell title="Request received">
        <div className={styles.success}>
          <span className={styles.successIcon} aria-hidden="true">
            <Icon name="check" size={34} />
          </span>
          <h3 className={styles.successTitle}>Thank you — your dates are reserved.</h3>
          <p className={styles.successText}>
            This is a demo checkout, so no payment was taken. In the live site
            you&apos;ll continue to a secure payment provider here. Our team would
            confirm your private tour within 24 hours.
          </p>
          <div className={styles.successActions}>
            <Button href="/" variant="outline" icon="arrow-right">
              Back to home
            </Button>
            <Button href={whatsappLink()} external icon="whatsapp" iconLeading>
              Message us on WhatsApp
            </Button>
          </div>
        </div>
      </StepShell>
    );
  }

  return (
    <StepShell
      title="Payment"
      description="Secure checkout is the final step. Card processing will be handled by a trusted payment provider."
    >
      <div className={styles.totalBox}>
        <span className={styles.totalLabel}>Amount due</span>
        <span className={styles.totalValue}>{formatGEL(total)}</span>
      </div>

      <div className={styles.placeholder} aria-hidden="true">
        <div className={styles.cardRow}>
          <Icon name="shield" size={18} />
          <span>Card details</span>
          <span className={styles.badge}>Secured</span>
        </div>
        <div className={styles.fakeInput} />
        <div className={styles.fakeInputRow}>
          <div className={styles.fakeInput} />
          <div className={styles.fakeInput} />
        </div>
      </div>

      <Button size="lg" icon="arrow-right" fullWidth onClick={onComplete}>
        Continue to payment
      </Button>

      <p className={styles.fine}>
        <Icon name="shield" size={15} />
        Demo only — no card is processed. Questions? Call {site.contact.phone}.
      </p>
    </StepShell>
  );
}
