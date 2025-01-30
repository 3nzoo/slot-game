import { Graphics, Container } from 'pixi.js';

export class SlotBorder extends Container {
  //? container for the whole background and border
  private panel: Container;

  //? border for the mask
  private border: Graphics;

  constructor() {
    super();

    this.panel = new Container();
    this.addChild(this.panel);

    this.border = new Graphics();
    this.border.roundRect(
      (window.innerWidth - 700) / 1.8,
      (window.innerHeight - 500) / 2,
      700,
      500,
      25
    );

    this.border.fill(0xffffff);
    this.border.stroke({ width: 20, color: 0xffd700 });
    this.panel = this.panel.addChild(this.border);
  }
  public resize(width: number, height: number) {
    this.border.x = (window.innerWidth - 700) / 1.8;
    this.border.height = (window.innerHeight - 500) / 1.5;
    this.panel.x = width * 0.5;
    this.panel.y = height * 0.5;
  }
}
