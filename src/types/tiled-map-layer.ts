import { TiledMapObject } from './tiled-map-object';

export interface TiledMapLayer {
  data: number[] | string;
  height: number;
  name: string;
  opacity: number;
  properties: { [key: string]: string };
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
