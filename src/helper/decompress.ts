/**
 * Decompression implementations
 */

import pako from 'pako';

/**
 * Simplest (passes data through since it's uncompressed)
 */
export const decompressCsv = (data: number[]) => {
  return data;
};

/**
 * Uses base64.js implementation to decode string into byte array
 * and then converts (with/without compression) to array of numbers
 */
export const decompressBase64 = (
  b64: string,
  encoding: string,
  compression: string
) => {
  let i: number;
  let j: number;
  let tmp: number;
  let arr: number[] | Uint8Array;

  if (b64.length % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  const Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

  const PLUS = '+'.charCodeAt(0);
  const SLASH = '/'.charCodeAt(0);
  const NUMBER = '0'.charCodeAt(0);
  const LOWER = 'a'.charCodeAt(0);
  const UPPER = 'A'.charCodeAt(0);
  const PLUS_URL_SAFE = '-'.charCodeAt(0);
  const SLASH_URL_SAFE = '_'.charCodeAt(0);

  /**
   *
   */
  function decode(elt: string) {
    const code = elt.charCodeAt(0);
    if (code === PLUS || code === PLUS_URL_SAFE) {
      return 62;
    } // '+'
    if (code === SLASH || code === SLASH_URL_SAFE) {
      return 63;
    } // '/'
    if (code < NUMBER) {
      return -1;
    } // no match
    if (code < NUMBER + 10) {
      return code - NUMBER + 26 + 26;
    }
    if (code < UPPER + 26) {
      return code - UPPER;
    }
    if (code < LOWER + 26) {
      return code - LOWER + 26;
    }
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  const len = b64.length;
  const placeHolders =
    b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr((b64.length * 3) / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  const l = placeHolders > 0 ? b64.length - 4 : b64.length;

  let L = 0;

  /**
   *
   */
  function push(v: number) {
    arr[L++] = v;
  }

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp =
      (decode(b64.charAt(i)) << 18) |
      (decode(b64.charAt(i + 1)) << 12) |
      (decode(b64.charAt(i + 2)) << 6) |
      decode(b64.charAt(i + 3));
    push((tmp & 0xff0000) >> 16);
    push((tmp & 0xff00) >> 8);
    push(tmp & 0xff);
  }

  if (placeHolders === 2) {
    tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4);
    push(tmp & 0xff);
  } else if (placeHolders === 1) {
    tmp =
      (decode(b64.charAt(i)) << 10) |
      (decode(b64.charAt(i + 1)) << 4) |
      (decode(b64.charAt(i + 2)) >> 2);
    push((tmp >> 8) & 0xff);
    push(tmp & 0xff);
  }

  // Byte array
  // handle compression
  if ('zlib' === compression || 'gzip' === compression) {
    arr = pako.inflate(arr);
  }

  const toNumber = function (byteArray: number[] | Uint8Array) {
    let value = 0;

    for (let i = byteArray.length - 1; i >= 0; i--) {
      value = value * 256 + byteArray[i] * 1;
    }

    return value;
  };

  const resultLen = arr.length / 4;
  const result = new Array<number>(resultLen);

  for (i = 0; i < resultLen; i++) {
    result[i] = toNumber(arr.slice(i * 4, i * 4 + 3));
  }

  return result;
};
