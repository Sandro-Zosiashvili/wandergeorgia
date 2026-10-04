'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminLogout, adminMe, type AdminUser } from '@/lib/adminApi';
import Icon, { type IconName } from '@/components/ui/Icon/Icon';
import styles from './AdminShell.module.scss';

const NAV: { label: string; href: string; icon: IconName; soon?: boolean }[] = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Bookings', href: '/admin/bookings', icon: 'calendar', soon: true },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // undefined = still checking, null = not authed (redirecting), else the user.
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    void adminMe().then((u) => {
      if (!active) return;
      if (!u) {
        setUser(null);
        router.replace('/admin/login');
        return;
      }
      setUser(u);
    });
    return () => {
      active = false;
    };
  }, [router]);

  const logout = async () => {
    setLoggingOut(true);
    await adminLogout();
    router.replace('/admin/login');
    router.refresh();
  };

  if (user === undefined) {
    return (
      <div className={styles.loading}>
        <span className={styles.bigSpinner} aria-label="Loading" />
      </div>
    );
  }
  if (user === null) return null; // redirecting to login

  return (
    <div className={styles.shell}>
      <div
        className={[styles.overlay, menuOpen ? styles.overlayOpen : ''].filter(Boolean).join(' ')}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className={[styles.sidebar, menuOpen ? styles.sidebarOpen : ''].filter(Boolean).join(' ')}>
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icons/W-icon.png" alt="" className={styles.mark} />
          <span className={styles.brandText}>
            <span className={styles.brandName}>WanderKartli</span>
            <span className={styles.brandSub}>Admin</span>
          </span>
        </div>

        <nav className={styles.nav} aria-label="Admin">
          {NAV.map((item) =>
            item.soon ? (
              <span key={item.href} className={[styles.navLink, styles.soon].join(' ')}>
                <Icon name={item.icon} size={19} />
                {item.label}
                <span className={styles.soonBadge}>Soon</span>
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={[styles.navLink, pathname === item.href ? styles.navActive : '']
                  .filter(Boolean)
                  .join(' ')}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={24} />
          </button>

          <span className={styles.spacer} />

          <span className={styles.account}>
            <span className={styles.accountEmail}>{user.email}</span>
            <span className={styles.accountRole}>{user.role}</span>
          </span>

          <button className={styles.logout} onClick={logout} disabled={loggingOut}>
            <Icon name="logout" size={18} />
            <span className={styles.logoutLabel}>{loggingOut ? 'Signing out…' : 'Logout'}</span>
          </button>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
