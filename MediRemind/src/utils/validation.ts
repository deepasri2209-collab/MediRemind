// ─── Validation Utilities ────────────────────────────────────────────────────

/** Only letters and spaces */
export const validateFullName = (name: string): boolean =>
  name.trim().length > 0 && /^[a-zA-Z\s]+$/.test(name.trim());

/** Exactly 10 digits */
export const validatePhone = (phone: string): boolean =>
  /^\d{10}$/.test(phone.trim());

/** Standard email format */
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/**
 * Password rules:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 digit
 * - At least 1 special character
 */
export const validatePassword = (password: string): boolean =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

/** HH:MM format (00:00 – 23:59) */
export const validateTime = (time: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(time.trim());

/** Non-empty string */
export const validateRequired = (value: string): boolean =>
  value.trim().length > 0;

/** Positive number */
export const validatePositiveNumber = (value: string): boolean => {
  const n = parseFloat(value);
  return !isNaN(n) && n > 0;
};

/** Integer in a range */
export const validateIntInRange = (value: string, min: number, max: number): boolean => {
  const n = parseInt(value, 10);
  return !isNaN(n) && n >= min && n <= max;
};
