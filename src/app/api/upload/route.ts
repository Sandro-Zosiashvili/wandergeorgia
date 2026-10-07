import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, STORAGE_BUCKET, STORAGE_PUBLIC_BASE, storageConfigured } from '@/lib/s3';

export const runtime = 'nodejs';

// Note: Vercel serverless functions cap the request body at ~4.5 MB, so this
// is comfortable for images and short clips. For large videos, switch to
// presigned direct-to-storage uploads.
const MAX_BYTES = 25 * 1024 * 1024;

/**
 * POST /api/upload — multipart image/video upload to Neon Object Storage.
 * Gated by the admin cookie; returns the permanent public URL of the object.
 * (Lives as a Next route so it is handled here, not proxied to the backend.)
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const jar = await cookies();
  if (!jar.get('access_token')?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!storageConfigured) {
    return NextResponse.json({ error: 'Object storage is not configured' }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided (field "file")' }, { status: 400 });
  }
  if (!/^(image|video)\//.test(file.type)) {
    return NextResponse.json({ error: 'Only image/* or video/* files are allowed' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds the 25 MB limit' }, { status: 413 });
  }

  const ext = (file.name.split('.').pop() ?? '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'bin';
  const key = `uploads/${Date.now()}-${randomUUID()}.${ext}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: STORAGE_BUCKET,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Upload failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }

  const url = `${STORAGE_PUBLIC_BASE}/${STORAGE_BUCKET}/${key}`;
  return NextResponse.json({ url });
}
