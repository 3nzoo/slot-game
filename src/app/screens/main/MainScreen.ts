//! call winning popup component
//! switch component

import { FancyButton } from '@pixi/ui';
import { animate } from 'motion';
import type { AnimationPlaybackControls } from 'motion/react';
import type { Ticker } from 'pixi.js';
import { Container } from 'pixi.js';

import { engine } from '../../getEngine';
import { PausePopup } from '../../popups/PausePopup';
import { SlotBoard } from '../../ui/slotBoard';
import { SpinButton } from '../../ui/SpinButton';
SpinButton;

/** The screen that holds the app */
export class MainScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ['main'];

  public mainContainer: Container;
  private pauseButton: FancyButton;
  private machineBase: SlotBoard;
  private spinButton: FancyButton;
  private spinDisabled: FancyButton;
  private paused = false;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);

    const buttonAnimations = {
      hover: {
        props: {
          scale: { x: 1.1, y: 1.1 },
        },
        duration: 100,
      },
      pressed: {
        props: {
          scale: { x: 0.9, y: 0.9 },
        },
        duration: 100,
      },
    };

    this.pauseButton = new FancyButton({
      defaultView: 'icon-pause.png',
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.pauseButton.onPress.connect(() =>
      engine().navigation.presentPopup(PausePopup)
    );
    this.addChild(this.pauseButton);

    this.machineBase = new SlotBoard({ width: 700, height: 500 });
    this.mainContainer.addChild(this.machineBase);

    this.spinDisabled = new SpinButton({
      width: 419,
    });
    this.spinDisabled.interactive = false;
    this.spinDisabled.defaultView = 'spin-disable.png';
    this.addChild(this.spinDisabled);

    this.spinButton = new SpinButton({
      width: 419,
    });

    this.spinButton.onPress.connect(() => {
      this.spinButton.visible = false;
      this.spinDisabled.visible = true;
      this.pauseButton.interactive = false;
      setTimeout(() => {
        this.spinButton.visible = true;
        this.spinDisabled.visible = false;
        this.pauseButton.interactive = true;
      }, 5000);
    });
    this.addChild(this.spinButton);
  }

  /** Prepare the screen just before showing */
  public prepare() {}

  /** Update the screen */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: Ticker) {
    if (this.paused) return;
    // this.bouncer.update();
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause() {
    this.mainContainer.interactiveChildren = false;
    this.paused = true;
  }

  /** Resume gameplay */
  public async resume() {
    this.mainContainer.interactiveChildren = true;
    this.paused = false;
  }

  /** Fully reset */
  public reset() {}

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    this.spinButton.x = centerX;
    this.spinButton.y = centerY * 1.6;
    this.spinDisabled.x = centerX;
    this.spinDisabled.y = centerY * 1.6;
    this.mainContainer.x = centerX;
    this.mainContainer.y = centerY;
    this.pauseButton.x = 30;
    this.pauseButton.y = 30;
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    engine().audio.bgm.play('main/sounds/bgm-main.mp3', { volume: 0.5 });

    const elementsToAnimate = [this.pauseButton];

    let finalPromise!: AnimationPlaybackControls;
    for (const element of elementsToAnimate) {
      element.alpha = 0;
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: 'backOut' }
      );
    }

    await finalPromise;
  }

  /** Hide screen with animations */
  public async hide() {}

  /** Auto pause the app when window go out of focus */
  public blur() {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup);
    }
  }
}
