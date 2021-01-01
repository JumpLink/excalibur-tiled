export interface TiledTilesetSource {
    firstgid: number;
    /**
     * Refers to external tileset file (should be JSON)
     * Only defined on external tilesets
     */
    source?: string;
}
