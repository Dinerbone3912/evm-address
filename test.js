import { test } from 'node:test';
import assert from 'node:assert';
import { toChecksumAddress, isValidAddress, isZeroAddress, ZERO_ADDRESS } from './index.js';
test('EIP-55 known vector', () => {
  assert.strictEqual(toChecksumAddress('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'), '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359');
  assert.strictEqual(toChecksumAddress('0x52908400098527886e0f7030069857d2e4169ee7'), '0x52908400098527886E0F7030069857D2E4169EE7');
});
test('checksum validation', () => {
  assert.strictEqual(isValidAddress('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'), true);
  assert.strictEqual(isValidAddress('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'), true); // unchecksummed ok
  assert.strictEqual(isValidAddress('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d35'), false); // too short
  assert.strictEqual(isValidAddress('not-an-address'), false);
});
test('bad checksum rejected', () => {
  // flip a char's case to break checksum
  assert.strictEqual(isValidAddress('0xFb6916095ca1df60bB79Ce92cE3Ea74c37c5d359'), false);
});
test('zero address', () => {
  assert.strictEqual(isZeroAddress(ZERO_ADDRESS), true);
  assert.strictEqual(isZeroAddress('0x944664B9d45fEf8C9BDBb084Ce59E6f6eE724861'), false);
});
