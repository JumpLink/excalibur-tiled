/**
 * Decompression implementations
 */
/**
 * Simplest (passes data through since it's uncompressed)
 */
export declare const decompressCsv: (data: number[]) => number[];
/**
 * Uses base64.js implementation to decode string into byte array
 * and then converts (with/without compression) to array of numbers
 */
export declare const decompressBase64: (b64: string, encoding: string, compression: string) => number[];
