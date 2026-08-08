// Deterministic generated avatars, keyed by a stable seed (user id, email,
// or name) — no upload flow needed yet, always renders something real.
export function avatarUrl(seed, { style = "notionists" } = {}) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}
