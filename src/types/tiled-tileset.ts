import { ITiledMapTerrain } from "./tiled-map-terrain";

export interface ITiledTileSet {
  firstgid: number;
  image: string;

  /**
   * Excalibur texture associated with this tileset
   */
  imageTexture: ex.Texture;
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
  terrains: ITiledMapTerrain[];
  tiles: { [key: string]: { terrain: number[] } };

  /**
   * Refers to external tileset file (should be JSON)
   */
  source: string;
}
