import type { TiledTileset } from './tiled-tileset';
export type PathAccessor = (path: string, ts?: TiledTileset) => string;
