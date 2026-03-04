import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL || 'http://10.0.0.1:8090';

/**
 * 서버 사이드에서 사용할 PocketBase 인스턴스 생성.
 * 요청마다 새 인스턴스를 생성해야 auth state가 공유되지 않는다.
 */
export function createPB() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  return pb;
}

export default createPB;
