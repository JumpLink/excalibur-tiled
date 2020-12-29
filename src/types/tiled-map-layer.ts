import { ITiledMapObject } from "./tiled-map-object";

export interface ITiledMapLayer {
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
  objects: ITiledMapObject[];
}
