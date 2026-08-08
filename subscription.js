// ========== Subscription / Access Code System ==========

const DEV_SECRET = 'DEV-MASTER-KEY-2024';
const CODE_PREFIX = 'CAD-';

export function generateAccessCode(durationDays = 30) {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const code = `${CODE_PREFIX}${random}`;
  const expiresAt = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
  return { code, expiresAt, durationDays };
}

export async function validateAccessCode(code) {
  if (!code || typeof code !== 'string') return { valid: false };

  // Developer master key - always valid
  if (code === DEV_SECRET) {
    return { valid: true, isDev: true, expiresAt: null };
  }

  // Check format
  if (!code.startsWith(CODE_PREFIX)) {
    return { valid: false, error: 'رمز غير صالح' };
  }

  const stored = localStorage.getItem(`sub_${code}`);
  if (!stored) {
    return { valid: false, error: 'الرمز غير موجود' };
  }

  try {
    const data = JSON.parse(stored);
    if (Date.now() > data.expiresAt) {
      return { valid: false, error: 'انتهت صلاحية الرمز' };
    }
    return { valid: true, expiresAt: data.expiresAt, durationDays: data.durationDays };
  } catch {
    return { valid: false, error: 'بيانات غير صالحة' };
  }
}

export function storeAccessCode(code, expiresAt, durationDays) {
  localStorage.setItem(`sub_${code}`, JSON.stringify({
    code,
    expiresAt,
    durationDays,
    createdAt: Date.now()
  }));
}

export function removeAccessCode(code) {
  localStorage.removeItem(`sub_${code}`);
}

export function listActiveCodes() {
  const codes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sub_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (Date.now() <= data.expiresAt) {
          codes.push(data);
        }
      } catch {
        // ignore
      }
    }
  }
  return codes;
}

export function isDevMode(code) {
  return code === DEV_SECRET;
}

export function getDevSecret() {
  return DEV_SECRET;
}
