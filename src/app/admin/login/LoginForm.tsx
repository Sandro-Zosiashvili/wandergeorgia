'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/adminApi';
import Icon from '@/components/ui/Icon/Icon';
import styles from './AdminLogin.module.scss';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      // Cookie is set; go to the dashboard (proxy will now allow it).
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icons/W-icon.png" alt="" className={styles.mark} />
          <span className={styles.brandText}>
            <span className={styles.brandName}>WanderKartli</span>
            <span className={styles.brandSub}>Admin</span>
          </span>
        </div>

        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Access your private dashboard.</p>

        {error ? (
          <p className={styles.error} role="alert">
            <Icon name="shield" size={16} />
            {error}
          </p>
        ) : null}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="you@wanderkartli.com"
            required
            disabled={loading}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <div className={styles.passwordWrap}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              tabIndex={-1}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={19} />
            </button>
          </div>
        </label>

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <Icon name="arrow-right" size={18} />
            </>
          )}
        </button>
      </form>

      <p className={styles.footnote}>WanderKartli · private tours across Georgia</p>
    </div>
  );
}
