import { Resource, TileMap } from 'excalibur';
import { TiledMap, TiledTileset, TiledMapFormat, PathResolve } from './types';
export declare class MapResource extends Resource<TiledMap> {
    protected mapFormat: TiledMapFormat;
    resolve: PathResolve;
    constructor(path: string, mapFormat?: TiledMapFormat);
    load(): Promise<TiledMap>;
    processData(data: TiledMap): TiledMap;
    getTilesetForTile(gid: number): TiledTileset;
    getTileMap(): TileMap;
}
