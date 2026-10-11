import type { Metadata } from 'next';
import MemoriesClient from './MemoriesClient';

export const metadata: Metadata = {
  title: 'Memories',
  robots: { index: false, follow: false },
};

export default function MemoriesAdminPage() {
  return <MemoriesClient />;
}
