const crypto = require('crypto');

// Algorithm: AES-256-GCM provides authenticated encryption with integrity verification
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Derives a consistent 32-byte key from environment secret or secure machine fallback
 */
function getMasterKey() {
  const masterSecret =
    process.env.PLATFORM_ENCRYPTION_KEY ||
    process.env.JWT_SECRET ||
    'whitelabel-platform-master-encryption-key-v1-secure';
  return crypto.createHash('sha256').update(masterSecret).digest();
}

/**
 * Encrypts a plaintext string (e.g. Razorpay Key Secret, API Token)
 * Returns hex string in format: iv:ciphertext:authTag
 */
function encrypt(text) {
  if (!text) return '';
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

/**
 * Decrypts an encrypted string produced by encrypt()
 */
function decrypt(ciphertextWithMetadata) {
  if (!ciphertextWithMetadata) return '';
  // Check if string matches format
  const parts = ciphertextWithMetadata.split(':');
  if (parts.length !== 3) {
    // If not encrypted in new format, return as-is for backward compatibility
    return ciphertextWithMetadata;
  }

  try {
    const key = getMasterKey();
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('❌ [EncryptionService] Decryption failed:', err.message);
    return '';
  }
}

/**
 * Masks a secret key for display in UI (e.g. "rzp_live_••••••••1234")
 */
function maskSecret(secret, visibleTrailingChars = 4) {
  if (!secret) return '';
  if (secret.length <= visibleTrailingChars) return '••••';
  const prefix = secret.slice(0, Math.min(6, secret.length - visibleTrailingChars));
  const suffix = secret.slice(-visibleTrailingChars);
  return `${prefix}••••••••${suffix}`;
}

module.exports = {
  encrypt,
  decrypt,
  maskSecret,
};
