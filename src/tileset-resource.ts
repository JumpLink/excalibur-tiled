import { Resource, Logger, Texture } from 'excalibur';
import { defaultPathAccessor } from './helper/path';
import {
  TiledTileset,
  TiledTilesetSource,
  PathAccessor,
  PathResolve,
} from './types';

export class TilesetResource extends Resource<
  TiledTileset | TiledTilesetSource
> {
  protected log = Logger.getInstance();
  protected rootPath: string;
  protected originalData: TiledTileset | TiledTilesetSource;
  // Resolve path alias
  public resolve: PathResolve = {};

  // Overwriteable
  public pathAccessor: PathAccessor;
  // Overwriteable
  public imagePathAccessor: PathAccessor;

  constructor(rootPath: string, tileset: TiledTileset | TiledTilesetSource) {
    super(tileset.source || rootPath, 'json');
    this.originalData = tileset;
    this.rootPath = rootPath;

    // Overwriteables
    this.pathAccessor = defaultPathAccessor.bind(this, this.rootPath);
    this.imagePathAccessor = defaultPathAccessor.bind(this, this.rootPath);
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
    this.log.debug('[TilesetResource] Load', this.originalData);

    // Load by tileset source
    if (this.isExternal()) {
      this.log.debug('Load external tileset..', this.originalData.source);
      await this.loadDataExternal();

      this.log.debug('External tileset loaded', this.data);

      // Is not external, set tileset directly
    } else {
      this.log.debug(
        '[TilesetResource] No external tileset',
        this.originalData
      );
    }

    if (!this.data) {
      throw new Error('Invalid tileset!');
    }

    await this.loadImage();
    return this.data as TiledTileset;
  }

  protected isExternal() {
    return Boolean(this.originalData.source);
  }

  protected async loadDataExternal() {
    this.log.debug('[TilesetResource] backupData', this.originalData);
    this.path = this.pathAccessor(this.originalData.source, this.resolve);
    this.log.debug('[TilesetResource] loadDataExternal', this.path);
    const data = await super.load();
    this.log.debug('[TilesetResource] data', data);
    Object.assign(data, this.originalData);

    return this.data as TiledTileset;
  }

  protected async loadImage() {
    this.log.debug('loadImage', this.data);
    const tileset = this.data as TiledTileset;
    if (!tileset.image) {
      this.log.warn('No image found in tileset!', tileset);
      return;
    }
    const tx = new Texture(this.imagePathAccessor(tileset.image, this.resolve));
    tileset.imageTexture = tx;
    await tx.load();

    this.log.debug('[Tiled] Loading associated tileset: ' + tileset.image);
  }
}
