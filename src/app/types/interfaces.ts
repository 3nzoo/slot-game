export interface Reel {
  [key: string]: any;
}

export interface Tween {
  reel: Reel;
  property: string;
  propertyBeginValue: any;
  target: number;
  easing: Function | null;
  time: number;
  change: Function | null;
  complete: Function | null;
  start: Date | number;
}
