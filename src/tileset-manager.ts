import { Resource, Promise as ExPromise } from "excalibur";
import { ITiledTileSet, PathAccessor } from "./types";
import { basename } from "./helper/path";

export interface TiledTilesetResourceList {
  [filename: string]: Resource<ITiledTileSet>;
}

export class TiledsetManager extends Resource<ITiledTileSet> {
  protected tilesets: TiledTilesetResourceList = {};

  public pathAccessor: PathAccessor = this.defaultPathAccessor;

  // constructor() {}

  public load(path: string, tileset: Partial<ITiledTileSet> = {}) {
    path = this.pathAccessor(path);
    const filename = basename(path);
    if (this.tilesets[filename]) {
      throw new Error(
        `A tileset with the name of "${filename}" has already been registered!`
      );
    }
    const tilesetResource = new Resource<ITiledTileSet>(path, "json");

    if (this.isExternal(tileset)) {
      return tilesetResource.load().then((external) => {
        Object.assign(tileset, external);
        return tileset;
      });
    }

    ExPromise.resolve();
  }

  protected isExternal(tileset: Partial<ITiledTileSet>) {
    return Boolean(tileset.source);
  }

  protected defaultPathAccessor(p: string) {
    // Use absolute path if specified
    if (p.indexOf("/") === 0) {
      return p;
    }

    // Load relative to map path
    const pp = this.path.split("/");
    const relPath = pp.concat([]);

    if (pp.length > 0) {
      // remove file part of path
      relPath.splice(-1);
    }
    relPath.push(p);
    return relPath.join("/");
  }
}
