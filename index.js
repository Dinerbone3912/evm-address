/**
 * @glider/evm-address — EIP-55 checksum + validation utilities. Zero deps.
 * Uses a compact keccak256 matching Ethereum's Keccak (not NIST SHA3).
 */
import { keccak256 } from './keccak.js';

const ZERO = '0x0000000000000000000000000000000000000000';

export function isHexAddress(a) {
  return typeof a === 'string' && /^0x[0-9a-fA-F]{40}$/.test(a);
}

/** Returns EIP-55 mixed-case checksum address. */
export function toChecksumAddress(address) {
  if (!isHexAddress(address)) throw new Error('invalid address');
  const lower = address.toLowerCase().replace(/^0x/, '');
  const hash = keccak256(lower).replace(/^0x/, '');
  let out = '0x';
  for (let i = 0; i < 40; i++) {
    out += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i];
  }
  return out;
}

/** True if address is a valid EIP-55 checksum OR all-lower/all-upper (unchecksummed). */
export function isValidAddress(address) {
  if (!isHexAddress(address)) return false;
  const body = address.slice(2);
  if (body === body.toLowerCase() || body === body.toUpperCase()) return true;
  return toChecksumAddress(address) === address;
}

export function isZeroAddress(a) {
  return typeof a === 'string' && a.toLowerCase() === ZERO;
}
export const ZERO_ADDRESS = ZERO;
export default { toChecksumAddress, isValidAddress, isHexAddress, isZeroAddress, ZERO_ADDRESS };
