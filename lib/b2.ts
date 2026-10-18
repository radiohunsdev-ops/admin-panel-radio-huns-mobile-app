
import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getB2Config() {
  const endpoint = process.env.B2_ENDPOINT;
  const region = process.env.B2_REGION;
  const bucket = process.env.B2_BUCKET_NAME;
  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;

  if (!endpoint || !region || !bucket || !keyId || !applicationKey) {
    throw new Error("Missing required Backblaze B2 environment variables.");
  }

  return {
    endpoint,
    region,
    bucket,
    keyId,
    applicationKey,
  };
}

export async function createB2PlaybackUrl(storageKey: string) {
  if (!storageKey?.trim()) {
    throw new Error("A valid Backblaze storage key is required.");
  }

  const config = getB2Config();

  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.keyId,
      secretAccessKey: config.applicationKey,
    },
  });

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: storageKey,
  });

  return getSignedUrl(client, command, {
    expiresIn: 60 * 60,
  });
}
