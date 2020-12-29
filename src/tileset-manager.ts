import { Resource } from 'excalibur';
import { TiledTileset, PathAccessor } from './types';
import { basename } from './helper/path';

export interface TiledTilesetResourceList {
  [filename: string]: TiledTileset;
}

export class TiledsetManager {
  protected tilesets: TiledTilesetResourceList = {};
  protected rootPath: string;

  public pathAccessor: PathAccessor = this.defaultPathAccessor;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  public async load(path: string, tileset: Partial<TiledTileset> = {}) {
    path = this.pathAccessor(path);
    const filename = basename(path);
    if (this.tilesets[filename]) {
      throw new Error(
        `A tileset with the name of "${filename}" has already been registered!`
      );
    }
    const tilesetResource = new Resource<TiledTileset>(path, 'json');

    if (this.isExternal(tileset)) {
      const external = await tilesetResource.load();
      Object.assign(tileset, external);
    }

    this.tilesets[filename] = tileset as TiledTileset;
  }

  protected isExternal(tileset: Partial<TiledTileset>) {
    return Boolean(tileset.source);
  }

  protected defaultPathAccessor(p: string) {
    // Use absolute path if specified
    if (p.indexOf('/') === 0) {
      return p;
    }

    // Load relative to map path
    const pp = this.rootPath.split('/');
    const relPath = pp.concat([]);

    if (pp.length > 0) {
      // remove file part of path
      relPath.splice(-1);
    }
    relPath.push(p);
    return relPath.join('/');
  }
}
