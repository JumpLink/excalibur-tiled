import type { Texture } from 'excalibur';
import { TiledMapTerrain } from './tiled-map-terrain';

export interface TiledTileset {
  firstgid: number;
  image: string;

  /**
   * Excalibur texture associated with this tileset
   */
  imageTexture: Texture;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  properties: { [key: string]: string };
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  transparentcolor: string;
  terrains: TiledMapTerrain[];
  tiles: { [key: string]: { terrain: number[] } };

  /**
   * Refers to external tileset file (should be JSON)
   * Only defined on external tilesets
   */
  source?: string;
}
