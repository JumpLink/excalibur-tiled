import { Resource, Logger } from 'excalibur';
import { TiledTileset, TiledTilesetSource, PathAccessor, PathResolve } from './types';
export declare class TilesetResource extends Resource<TiledTileset | TiledTilesetSource> {
    protected log: Logger;
    protected rootPath: string;
    protected originalData: TiledTileset | TiledTilesetSource;
    resolve: PathResolve;
    pathAccessor: PathAccessor;
    imagePathAccessor: PathAccessor;
    constructor(rootPath: string, tileset: TiledTileset | TiledTilesetSource);
    /**
     * Load tileset data
     * If we find an image property, then
     * load the image and sprite
     *
     * If we find a source property, then
     * load the tileset data, merge it with
     * existing data, and load the image and sprite
     */
    load(): Promise<TiledTileset>;
    protected isExternal(): boolean;
    protected loadDataExternal(): Promise<TiledTileset>;
    protected loadImage(): Promise<void>;
}
