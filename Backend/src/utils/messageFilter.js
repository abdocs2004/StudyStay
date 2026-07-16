// Detects and redacts attempts to share off-platform contact info in chat
// messages. This is intentionally a best-effort filter (not a security
// boundary) — its purpose is to nudge users toward the paid unlock flow,
// not to be unbeatable against a determined user.

const PATTERNS = [
  // Phone numbers: sequences of 7+ digits, optionally grouped with spaces/dashes/dots
  /(\+?\d[\d\s\-.]{6,}\d)/g,
  // Emails
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  // URLs / domains
  /(https?:\/\/\S+)|(www\.\S+)|(\b[a-zA-Z0-9-]+\.(com|net|org|me|ly|co)\b\S*)/gi,
  // Social media / messaging app mentions
  /(واتساب|واتس اب|whatsapp|wa\.me|تيليجرام|telegram|t\.me|فيسبوك|facebook|fb\.com|انستجرام|انستقرام|instagram|insta|تويتر|twitter|snapchat|سناب شات)/gi,
  // @usernames (social handles)
  /@[a-zA-Z0-9_.]{3,}/g,
];

export const containsContactInfo = (text) => {
  if (!text) return false;
  return PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
};

export const filterMessage = (text) => {
  if (!text) return { filtered: text, wasFiltered: false };

  let filtered = text;
  let wasFiltered = false;

  PATTERNS.forEach((pattern) => {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      wasFiltered = true;
    }
    pattern.lastIndex = 0;
    filtered = filtered.replace(pattern, '********');
  });

  return { filtered, wasFiltered };
};
