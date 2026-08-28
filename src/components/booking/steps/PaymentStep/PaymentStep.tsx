import { formatGEL } from '@/lib/format';
import StepShell from '../../StepShell/StepShell';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { site, whatsappLink } from '@/config/site';
import styles from './PaymentStep.module.scss';

interface PaymentStepProps {
  total: number;
  isComplete: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}

/**
 * Final step — no online payment. Submitting sends the request to our backend,
 * which emails the team (full details) and the traveler (a confirmation copy).
 */
export default function PaymentStep({
  total,
  isComplete,
  isSubmitting,
  submitError,
  onSubmit,
}: PaymentStepProps) {
  if (isComplete) {
    return (
      <StepShell title="Request received">
        <div className={styles.success}>
          <span className={styles.successIcon} aria-hidden="true">
            <Icon name="check" size={34} />
          </span>
          <h3 className={styles.successTitle}>Thank you — your request is on its way.</h3>
          <p className={styles.successText}>
            We&apos;ve emailed you a confirmation and our team will get back to you
            within 24 hours to finalise your private tour. No payment is taken now —
            you&apos;ll arrange it directly with us.
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
      title="Confirm your request"
      description="Send us your trip details and we'll reply within 24 hours to confirm everything. No payment is required now."
    >
      <div className={styles.totalBox}>
        <span className={styles.totalLabel}>Estimated total</span>
        <span className={styles.totalValue}>{formatGEL(total)}</span>
      </div>

      {submitError ? (
        <p className={styles.error} role="alert">
          <Icon name="shield" size={16} />
          {submitError}
        </p>
      ) : null}

      <Button
        size="lg"
        icon="arrow-right"
        fullWidth
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending…' : 'Send booking request'}
      </Button>

      <p className={styles.fine}>
        <Icon name="shield" size={15} />
        We only use your details to arrange this tour. Questions? Call {site.contact.phone}.
      </p>
    </StepShell>
  );
}
