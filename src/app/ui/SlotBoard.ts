import { Container, NineSliceSprite, Texture } from 'pixi.js';
import { SlotBoardOptions } from '../types/interfaces';

const defaultSlotBoardOptions = {
  color: 0xffffff,
  width: 550,
  height: 600,
};

export class SlotBoard extends Container {
  private image: NineSliceSprite;

  constructor(options: Partial<SlotBoardOptions> = {}) {
    super();
    const opts = { ...defaultSlotBoardOptions, ...options };

    //? Slot Machine background
    this.image = new NineSliceSprite({
      texture: Texture.from('slotMachine.png'),
      width: opts.width,
      height: opts.height,
      tint: opts.color,
    });
    this.image.x = -this.image.width * 0.5;
    this.image.y = -this.image.height * 0.7;
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
