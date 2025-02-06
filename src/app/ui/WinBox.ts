import { Container, NineSliceSprite, Texture } from 'pixi.js';

const defaultWinBoxOptions = {
  color: 0xffffff,
  width: 350,
  height: 600,
};

export type WinBoxOptions = typeof defaultWinBoxOptions;

/**
 * Generic rounded box based on a nine-sliced sprite that can be resized freely.
 */
export class WinBox extends Container {
  /** The rectangular area, that scales without distorting rounded corners */
  private image: NineSliceSprite;

  constructor(options: Partial<WinBoxOptions> = {}) {
    super();
    const opts = { ...defaultWinBoxOptions, ...options };
    this.image = new NineSliceSprite({
      texture: Texture.from('win7.png'),
      leftWidth: 34,
      topHeight: 34,
      rightWidth: 34,
      bottomHeight: 34,
      width: opts.width,
      height: opts.height,
    });
    this.image.x = -this.image.width * 0.5;
    this.image.y = -this.image.height * 0.5;
    this.addChild(this.image);
  }

  /** Get the base width, without counting the shadow */
  public get boxWidth() {
    return this.image.width;
  }

  /** Get the base height, without counting the shadow */
  public get boxHeight() {
    return this.image.height;
  }
}
