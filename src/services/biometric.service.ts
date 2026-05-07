const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const BiometricService = {
  async enroll() {
    await sleep(700);
    return { success: true };
  },

  async verify() {
    await sleep(700);
    return { event_type: 'VERIFIED' as const, confidence_score: 0.93 };
  },
};
