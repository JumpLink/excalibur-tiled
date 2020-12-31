import type { PathResolve } from './path-resolve';
export type PathAccessor = (path: string, resolve?: PathResolve) => string;
