import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const requiredEnv = ['S3_BUCKET_NAME', 'S3_REGION'];

function getEnv(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  return value;
}

const s3Client = new S3Client({
  region: getEnv('S3_REGION'),
  credentials: getEnv('S3_ACCESS_KEY_ID') && getEnv('S3_SECRET_ACCESS_KEY')
    ? {
        accessKeyId: getEnv('S3_ACCESS_KEY_ID'),
        secretAccessKey: getEnv('S3_SECRET_ACCESS_KEY'),
      }
    : undefined,
});

export async function uploadBufferToS3({ key, contentType, buffer, cacheControl = 'public, max-age=31536000, immutable' }) {
  const Bucket = getEnv('S3_BUCKET_NAME');
  if (!Bucket) {
    throw new Error('S3_BUCKET_NAME is not set');
  }

  const put = new PutObjectCommand({
    Bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream',
    ACL: getEnv('S3_ACL', 'public-read'),
    CacheControl: cacheControl,
  });

  await s3Client.send(put);

  const publicBase = getEnv('S3_PUBLIC_BASE_URL');
  if (publicBase) {
    return `${publicBase.replace(/\/$/, '')}/${key}`;
  }

  // Fallback to virtual-hosted–style URL
  const region = getEnv('S3_REGION');
  return `https://${Bucket}.s3.${region}.amazonaws.com/${key}`;
}

export default s3Client;


