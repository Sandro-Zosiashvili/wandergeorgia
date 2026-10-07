import { S3Client } from '@aws-sdk/client-s3';

/**
 * S3 client for Neon Object Storage (S3-compatible). Configured from env:
 *   AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION,
 *   NEON_STORAGE_BUCKET
 * `forcePathStyle` is required for the custom (non-AWS) endpoint, and uploaded
 * objects are publicly readable at `${endpoint}/${bucket}/${key}` — a permanent
 * URL, no presigning needed.
 */
const endpoint = (process.env.AWS_ENDPOINT_URL_S3 ?? '').replace(/\/$/, '');

export const STORAGE_BUCKET = process.env.NEON_STORAGE_BUCKET ?? 'wanderkartli';
/** Base of the permanent public URL for an object: `${PUBLIC_BASE}/${bucket}/${key}`. */
export const STORAGE_PUBLIC_BASE = endpoint;
export const storageConfigured = Boolean(endpoint && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

export const s3 = new S3Client({
  forcePathStyle: true,
  endpoint,
  region: process.env.AWS_REGION ?? 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});
