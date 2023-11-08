import * as crypto from 'crypto'

export function generateInvitationCode() {
  const bytes = crypto.randomBytes(4);
  const code = bytes.toString('hex').toUpperCase();

  return `${code.substring(0, 4)}-${code.substring(4, 8)}`;
}
