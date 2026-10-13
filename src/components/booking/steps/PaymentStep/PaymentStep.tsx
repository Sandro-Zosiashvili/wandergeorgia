import { formatUSD } from '@/lib/format';
import StepShell from '../../StepShell/StepShell';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { site, whatsappLink } from '@/config/site';
import { useLocale } from '@/hooks/useLocale';
import { localePath } from '@/lib/locale';
import { ui, tpl } from '@/lib/uiStrings';
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
  const locale = useLocale();
  const t = ui(locale).booking.paymentStep;

  if (isComplete) {
    return (
      <StepShell title={t.receivedTitle}>
        <div className={styles.success}>
          <span className={styles.successIcon} aria-hidden="true">
            <Icon name="check" size={34} />
          </span>
          <h3 className={styles.successTitle}>{t.successTitle}</h3>
          <p className={styles.successText}>{t.successText}</p>
          <div className={styles.successActions}>
            <Button href={localePath(locale, '/')} variant="outline" icon="arrow-right">
              {t.backHome}
            </Button>
            <Button href={whatsappLink()} external icon="whatsapp" iconLeading>
              {t.messageWhatsapp}
            </Button>
          </div>
        </div>
      </StepShell>
    );
  }

  return (
    <StepShell title={t.confirmTitle} description={t.confirmDescription}>
      <div className={styles.totalBox}>
        <span className={styles.totalLabel}>{t.estimatedTotal}</span>
        <span className={styles.totalValue}>{formatUSD(total)}</span>
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
        {isSubmitting ? t.sending : t.sendRequest}
      </Button>

      <p className={styles.fine}>
        <Icon name="shield" size={15} />
        {tpl(t.fine, { phone: site.contact.phone })}
      </p>
    </StepShell>
  );
}
