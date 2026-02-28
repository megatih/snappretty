export interface RedactionPattern {
  name: string;
  regex: RegExp;
  replacement: string;
}

export const REDACTION_PATTERNS: RedactionPattern[] = [
  {
    name: 'Email Addresses',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: '████@████.███',
  },
  {
    name: 'API Keys (generic)',
    regex: /(?:api[_-]?key|apikey|api[_-]?secret|secret[_-]?key)\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
    replacement: 'API_KEY=████████████████████',
  },
  {
    name: 'AWS Access Key',
    regex: /AKIA[0-9A-Z]{16}/g,
    replacement: 'AKIA████████████████',
  },
  {
    name: 'AWS Secret Key',
    regex: /(?:aws_secret_access_key|secret_key)\s*[:=]\s*['"]?([a-zA-Z0-9/+=]{40})['"]?/gi,
    replacement: 'aws_secret_access_key=████████████████████',
  },
  {
    name: 'IPv4 Addresses',
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
    replacement: '███.███.███.███',
  },
  {
    name: 'Credit Card Numbers',
    regex: /\b(?:\d[ -]*?){13,19}\b/g,
    replacement: '████ ████ ████ ████',
  },
  {
    name: 'Bearer Tokens',
    regex: /Bearer\s+[a-zA-Z0-9._\-]{10,}/gi,
    replacement: 'Bearer ████████████████',
  },
  {
    name: 'Private Keys',
    regex: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA )?PRIVATE KEY-----/g,
    replacement: '-----BEGIN PRIVATE KEY-----\n████████████████\n-----END PRIVATE KEY-----',
  },
  {
    name: 'GitHub Tokens',
    regex: /gh[pousr]_[a-zA-Z0-9]{36,}/g,
    replacement: 'ghp_████████████████████████████████████',
  },
  {
    name: 'Slack Tokens',
    regex: /xox[baprs]-[a-zA-Z0-9-]{10,}/g,
    replacement: 'xoxb-████████████████████',
  },
];

export function detectSensitiveText(text: string): { pattern: RedactionPattern; matches: string[] }[] {
  const results: { pattern: RedactionPattern; matches: string[] }[] = [];

  for (const pattern of REDACTION_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
    }
    if (matches.length > 0) {
      results.push({ pattern, matches });
    }
  }

  return results;
}

export function redactText(text: string, patterns?: RedactionPattern[]): string {
  const patternsToUse = patterns ?? REDACTION_PATTERNS;
  let result = text;

  for (const pattern of patternsToUse) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    result = result.replace(regex, pattern.replacement);
  }

  return result;
}
