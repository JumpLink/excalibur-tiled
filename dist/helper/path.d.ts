import { PathResolve } from '../types/path-resolve';
/**
 * Returns the last portion of a path, similar to the Unix basename command.
 * @param path
 */
export declare function basename(path: string): string;
export declare const defaultPathAccessor: (rootPath: string, path: string, resolve?: PathResolve) => string;
