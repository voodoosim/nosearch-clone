import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL || 'http://10.0.0.1:8090';

export function createPB(timeoutMs = 1500) {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  pb.beforeSend = function (url, options) {
    options.signal = AbortSignal.timeout(timeoutMs);
    return { url, options };
  };
  return pb;
}

export async function createAdminPB() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.collection('_superusers').authWithPassword(
    process.env.PB_ADMIN_EMAIL!,
    process.env.PB_ADMIN_PASSWORD!,
  );
  return pb;
}

export default createPB;
