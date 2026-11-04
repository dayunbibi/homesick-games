// "뭐랑 먹을래요?" — only for fun, shows up on the result card
export type PairingKey = "dongchimi" | "kimchi" | "milk" | "cider";

export const PAIRINGS: Record<PairingKey, { name: string; type: string }> = {
  dongchimi: { name: "동치미", type: "정통파" },
  kimchi: { name: "김치", type: "국룰파" },
  milk: { name: "우유", type: "부드러움파" },
  cider: { name: "사이다", type: "목메임 방지파" },
};

export const PAIRING_KEYS = Object.keys(PAIRINGS) as PairingKey[];
