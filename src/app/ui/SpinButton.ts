import { FancyButton } from '@pixi/ui';

import { engine } from '../getEngine';

const defaultSpinButtonOptions = {
  width: 419,
  height: 243,
};

import { SpinButtonOptions } from '../types/interfaces';

export class SpinButton extends FancyButton {
  constructor(options: Partial<SpinButtonOptions> = {}) {
    const opts = { ...defaultSpinButtonOptions, ...options };

    super({
      defaultView: 'spin.png',
      nineSliceSprite: [38, 50, 38, 50],
      anchor: 0.5,
      scale: 0.6,
      animations: {
        hover: {
          props: {
            scale: { x: 1.03, y: 1.03 },
            y: 0,
          },
          duration: 100,
        },
        pressed: {
          props: {
            scale: { x: 0.97, y: 0.97 },
            y: 10,
          },
          duration: 100,
        },
      },
    });

    this.width = opts.width;
    this.height = opts.height;

    this.onDown.connect(this.handleDown.bind(this));
  }

  private handleDown() {
    // this.defaultView = 'spin-down.png';
    // this.visible = false;
    engine().audio.sfx.play('main/sounds/sfx-hover.wav');
  }
}
