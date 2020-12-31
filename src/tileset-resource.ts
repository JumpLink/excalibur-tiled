import { Resource, Logger, Texture } from 'excalibur';
import { defaultPathAccessor } from './helper/path';
import { TiledTileset, TiledTilesetSource, PathAccessor } from './types';

export class TilesetResource extends Resource<
  TiledTileset | TiledTilesetSource
> {
  protected log = Logger.getInstance();
  protected rootPath: string;

  // Overwriteable
  public pathAccessor: PathAccessor = this.defaultPathAccessor;
  // Overwriteable
  public imagePathAccessor: PathAccessor = this.defaultPathAccessor;

  constructor(rootPath: string, tileset: TiledTileset | TiledTilesetSource) {
    super(tileset.source || rootPath, 'json');
    this.data = tileset;
    this.rootPath = rootPath;
  }

  /**
   * Load tileset data
   * If we find an image property, then
   * load the image and sprite
   *
   * If we find a source property, then
   * load the tileset data, merge it with
   * existing data, and load the image and sprite
   */
  public async load(): Promise<TiledTileset> {
    this.log.debug('[TilesetResource] Load', this.data);

    // Load by tileset source
    if (this.isExternal()) {
      this.log.debug('Load external tileset..', this.data.source);
      await this.loadDataExternal();

      this.log.debug('External tileset loaded: ', this.data);

      // Is not external, set tileset directly
    } else {
      this.log.debug('[TilesetResource] No external tileset', this.data);
    }

    if (!this.data) {
      throw new Error('Invalid tileset!');
    }

    await this.loadImage();
    return this.data as TiledTileset;
  }

  protected isExternal() {
    return Boolean(this.data.source);
  }

  protected async loadDataExternal(
    tileset: Partial<TiledTilesetSource> = {},
    source?: string
  ) {
    source = source || tileset.source;
    source = this.pathAccessor(source);
    this.log.debug('[TilesetResource] loadDataExternal', source);
    const external = await super.load();
    this.log.debug('[TilesetResource] external', external);
    Object.assign(tileset, external);

    return tileset as TiledTileset;
  }

  protected async loadImage() {
    this.log.debug('loadImage', this.data);
    const tileset = this.data as TiledTileset;
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
    return defaultPathAccessor(this.path, p);
  }
}
