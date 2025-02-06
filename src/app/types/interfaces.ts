import { Sprite, Container, BlurFilter } from 'pixi.js';
export interface Reel {
  [key: string]: any;
}

export interface Tween {
  object: Reel;
  property: string;
  propertyBeginValue?: Reel[];
  target: number;
  easing: Function | null;
  time: number;
  change: any;
  complete: any;
  start?: any;
}

export type SlotBoardOptions = {
  color: number;
  width: number;
  height: number;
};

export type SpinButtonOptions = object;

export interface Reels {
  container: Container;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter;
}
