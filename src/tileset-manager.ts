import { Resource, Logger, Texture } from 'excalibur';
import { TiledTileset, TiledTilesetSource, PathAccessor } from './types';

export class TilesetManager {
  protected tilesets: TiledTileset[] = [];
  protected rootPath: string;
  protected log = Logger.getInstance();

  public pathAccessor: PathAccessor = this.defaultPathAccessor;
  public imagePathAccessor: PathAccessor = this.defaultPathAccessor;

  constructor(rootPath: string = '/') {
    this.rootPath = rootPath;
  }

  public getByName(name: string) {
    return this.tilesets.find((ts) => ts.name === name);
  }

  public getBySource(source: string) {
    return this.tilesets.find((ts) => ts.source === source);
  }

  /**
   * Loop through loaded tileset data
   * If we find an image property, then
   * load the image and sprite
   *
   * If we find a source property, then
   * load the tileset data, merge it with
   * existing data, and load the image and sprite
   * @param tilesets
   */
  public async loadMany(tilesets: Array<TiledTileset | TiledTilesetSource>) {
    for (const tileset of tilesets) {
      await this.load(tileset);
    }
    return this.tilesets;
  }

  /**
   * Load tileset data
   * If we find an image property, then
   * load the image and sprite
   *
   * If we find a source property, then
   * load the tileset data, merge it with
   * existing data, and load the image and sprite
   * @param tileset Internal tileset or tileset with source property to load
   * @param source Overwrite the source, e.g. if you want to resolve the tileset with another name
   */
  public async load(tileset: Partial<TiledTileset> = {}, source?: string) {
    this.log.debug('[TilesetManager] Load', tileset, source);
    let resolvedTileset: TiledTileset | undefined;

    // Load by tileset source
    if (tileset.source || source) {
      const _source = source || tileset.source;
      this.log.debug('Load external tileset..', _source);
      const exists = Boolean(this.getBySource(_source));
      if (exists) {
        this.log.debug(
          `A tileset with source "${_source}" has already been registered!`
        );
        return;
      }

      resolvedTileset = await this.loadDataExternal(tileset, source);

      this.log.debug('External tileset loaded: ', resolvedTileset);

      // Is not external, set tileset directly
    } else if (tileset.name) {
      const exists = Boolean(this.getByName(tileset.source));
      if (exists) {
        this.log.debug(
          `A tileset with name "${tileset.name}" has already been registered!`
        );
        return;
      }
      resolvedTileset = tileset as TiledTileset;
    }

    if (!resolvedTileset) {
      throw new Error('Invalid tileset!');
    }

    await this.loadImage(resolvedTileset);
    this.tilesets.push(resolvedTileset);
    return resolvedTileset;
  }

  protected async loadDataExternal(
    tileset: Partial<TiledTilesetSource> = {},
    source?: string
  ) {
    source = source || tileset.source;
    source = this.pathAccessor(source);
    this.log.debug('[TilesetManager] loadDataExternal', source);
    const tilesetResource = new Resource<TiledTileset>(source, 'json');
    const external = await tilesetResource.load();
    this.log.debug('[TilesetManager] external', external);
    Object.assign(tileset, external);

    return tileset as TiledTileset;
  }

  protected async loadImage(tileset: TiledTileset) {
    this.log.debug('loadImage', tileset);
    if (!tileset.image) {
      this.log.warn('No image found in tileset!', tileset);
      return;
    }
    const tx = new Texture(this.imagePathAccessor(tileset.image, tileset));
    tileset.imageTexture = tx;
    await tx.load();

    this.log.debug('[Tiled] Loading associated tileset: ' + tileset.image);
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
