import { TiledTileset } from './tiled-tileset';
import { TiledMapLayer } from './tiled-map-layer';

/**
 * Tiled Map Interface
 *
 * Represents the interface for the Tiled exported data structure (JSON). Used
 * when loading resources via Resource loader.
 */
export interface TiledMap {
  width: number;
  height: number;
  layers: TiledMapLayer[];
  nextobjectid: number;

  /**
   * Map orientation (orthogonal)
   */
  orientation: string;
  properties: { [key: string]: string };

  /**
   * Render order (right-down)
   */
  renderorder: string;
  tileheight: number;
  tilewidth: number;
  tilesets: TiledTileset[];
  version: number;
}
