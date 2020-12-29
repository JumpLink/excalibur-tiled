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
  properties: {
    [key: string]: string;
  };
  /**
   * Render order (right-down)
   */
  renderorder: string;
  tileheight: number;
  tilewidth: number;
  tilesets: TiledTileset[];
  version: number;
}
export interface TiledMapLayer {
  data: number[] | string;
  height: number;
  name: string;
  opacity: number;
  properties: {
    [key: string]: string;
  };
  encoding: string;
  compression?: string;
  /**
   * Type of layer (tilelayer, objectgroup)
   */
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
  /**
   * Draw order (topdown (default), index)
   */
  draworder: string;
  objects: TiledMapObject[];
}
export interface TiledMapObject {
  id: number;
  /**
   * Tile object id
   */
  gid: number;
  height: number;
  name: string;
  properties: {
    [key: string]: string;
  };
  rotation: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
  /**
   * Whether or not object is an ellipse
   */
  ellipse: boolean;
  /**
   * Polygon points
   */
  polygon: {
    x: number;
    y: number;
  }[];
  /**
   * Polyline points
   */
  polyline: {
    x: number;
    y: number;
  }[];
}
export interface TiledTileset {
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
  properties: {
    [key: string]: string;
  };
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  transparentcolor: string;
  terrains: TiledMapTerrain[];
  tiles: {
    [key: string]: {
      terrain: number[];
    };
  };
  /**
   * Refers to external tileset file (should be JSON)
   */
  source: string;
}
export interface TiledMapTerrain {
  name: string;
  tile: number;
}
