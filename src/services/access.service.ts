const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const AccessService = {
  async scanNfc() {
    await sleep(600);
    return {
      allowed: true,
      location_id: 'main-gate',
      reason: 'Access granted',
    };
  },
};
