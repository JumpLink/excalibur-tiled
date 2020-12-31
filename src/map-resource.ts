import { Resource, TileMap, TileSprite, SpriteSheet } from 'excalibur';
import { TiledMap, TiledTileset, TiledMapFormat } from './types';
import { decompressBase64, decompressCsv } from './helper/decompress';
import { TilesetResource } from './tileset-resource';

export class MapResource extends Resource<TiledMap> {
  protected mapFormat: TiledMapFormat;
  // protected tilesetResources: TilesetResource[] = [];
  public path: string;

  constructor(path: string, mapFormat = TiledMapFormat.JSON) {
    super(path, 'json');
    if (mapFormat !== TiledMapFormat.JSON) {
      throw `The format ${mapFormat} is not currently supported. Please export Tiled map as JSON.`;
    }

    console.debug('TiledResource path', path);

    this.mapFormat = mapFormat;
  }

  public async load(): Promise<TiledMap> {
    const map = await super.load();
    for (let ts of this.data.tilesets) {
      const tilesetResource = new TilesetResource(this.path, ts);
      ts = await tilesetResource.load();
    }

    return map;
  }

  public processData(data: TiledMap): TiledMap {
    if (typeof data !== 'object') {
      throw `Tiled map resource ${this.path} is not the correct content type`;
    }
    if (data === void 0) {
      throw `Tiled map resource ${this.path} is empty`;
    }

    switch (this.mapFormat) {
      case TiledMapFormat.JSON:
        return parseJsonMap(data);
    }
  }

  public getTilesetForTile(gid: number): TiledTileset {
    for (let i = this.data.tilesets.length - 1; i >= 0; i--) {
      const ts = this.data.tilesets[i];

      if (ts.firstgid <= gid) {
        return ts;
      }
    }

    return null;
  }

  public getTileMap(): TileMap {
    const map = new TileMap(
      0,
      0,
      this.data.tilewidth,
      this.data.tileheight,
      this.data.height,
      this.data.width
    );

    // register sprite sheets for each tileset in map
    for (const ts of this.data.tilesets) {
      const cols = Math.floor(ts.imagewidth / ts.tilewidth);
      const rows = Math.floor(ts.imageheight / ts.tileheight);
      const ss = new SpriteSheet(
        ts.imageTexture,
        cols,
        rows,
        ts.tilewidth,
        ts.tileheight
      );

      map.registerSpriteSheet(ts.firstgid.toString(), ss);
    }

    for (const layer of this.data.layers) {
      if (layer.type === 'tilelayer') {
        for (let i = 0; i < layer.data.length; i++) {
          const gid = <number>layer.data[i];

          if (gid !== 0) {
            const ts = this.getTilesetForTile(gid);

            map.data[i].sprites.push(
              new TileSprite(ts.firstgid.toString(), gid - ts.firstgid)
            );
          }
        }
      }
    }

    return map;
  }
}

/**
 * Handles parsing of JSON tiled data
 */
const parseJsonMap = (data: TiledMap): TiledMap => {
  // Decompress layers
  if (data.layers) {
    for (const layer of data.layers) {
      if (typeof layer.data === 'string') {
        if (layer.encoding === 'base64') {
          layer.data = decompressBase64(
            <string>layer.data,
            layer.encoding,
            layer.compression || ''
          );
        }
      } else {
        layer.data = decompressCsv(<number[]>layer.data);
      }
    }
  }

  return data;
};
