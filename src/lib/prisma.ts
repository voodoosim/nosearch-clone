// TODO: PocketBase로 전환 예정 — 현재 더미
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler: ProxyHandler<any> = {
  get(_target, _prop) {
    return new Proxy({}, {
      get() {
        return async () => null;
      }
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any = new Proxy({}, handler);
