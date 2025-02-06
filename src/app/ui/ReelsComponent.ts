import { Ticker, BlurFilter, Container, Sprite, Texture } from 'pixi.js';
import { Reel, Reels, Tween } from '../types/interfaces';
import { backout, lerp } from '../../engine/utils/maths';
import { col } from '../constants';
import { engine } from '../getEngine';
import { WinPopup } from '../popups/WinPopup';
import { CongratsPopup } from '../popups/CongratsPopup';

const defaultReelOptions = {
  width: 225,
  height: 140,
};

export type ReelOptions = typeof defaultReelOptions;

export class ReelsComponent extends Container {
  /** The rectangular area, that scales without distorting rounded corners */
  private slotTextures = [
    Texture.from('01.png'),
    Texture.from('02.png'),
    Texture.from('03.png'),
    Texture.from('04.png'),
    Texture.from('05.png'),
    Texture.from('06.png'),
    Texture.from('07.png'),
    Texture.from('08.png'),
    Texture.from('09.png'),
    Texture.from('10.png'),
  ];

  private tweening: Tween[] = [];
  private reelContainer: Container;
  private reels: Reels[];
  private symbol!: Sprite;
  private reel: any;
  private running: boolean;

  constructor(options: Partial<ReelOptions> = {}) {
    super();
    const opts = { ...defaultReelOptions, ...options };

    const REEL_WIDTH = opts.width;
    const SYMBOL_SIZE = opts.height;

    // let running = false;

    this.reelContainer = new Container();
    // this.rc = new Container();

    this.running = false;

    //? Build the reels
    this.reels = [];

    for (let i = 0; i < 3; i++) {
      const rc = new Container();

      rc.x = i * REEL_WIDTH;
      this.reelContainer.addChild(rc);

      this.reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      };

      this.reel.blur.strengthX = 0;
      this.reel.blur.strengthY = 0;
      rc.filters = [this.reel.blur];

      // Build the symbols
      for (let j = 0; j < col[i].length; j++) {
        this.symbol = new Sprite(this.slotTextures[col[i][j]]);

        // Scale the symbol to fit symbol area.
        this.symbol.y = j * SYMBOL_SIZE;
        this.symbol.scale.x = this.symbol.scale.y = Math.min(
          SYMBOL_SIZE / this.symbol.width,
          SYMBOL_SIZE / this.symbol.height
        );
        this.symbol.x = Math.round((SYMBOL_SIZE - this.symbol.width + 20) / 2);
        this.reel.symbols.push(this.symbol);

        rc.addChild(this.symbol);
      }
      this.reels.push(this.reel);
    }

    this.reelContainer.y = -310;
    this.reelContainer.x = -300;
    this.addChild(this.reelContainer);

    Ticker.shared.add(() => {
      const now = Date.now();
      const remove: any[] = [];

      for (let i = 0; i < this.tweening.length; i++) {
        const t: any = this.tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(
          t.propertyBeginValue,
          t.target,
          t.easing(phase)
        );
        if (t.change) t.change(t);
        if (phase === 1) {
          t.object[t.property] = t.target;
          if (t.complete) t.complete(t);
          remove.push(t);
        }
      }
      for (let i = 0; i < remove.length; i++) {
        this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
      }
    });

    Ticker.shared.add(() => {
      for (let i = 0; i < this.reels.length; i++) {
        const r: Reels = this.reels[i];

        r.blur.strengthY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        // Update symbol positions on reel.
        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];

          s.y =
            ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        }
      }
    });
  }

  public startPlay(column: Reel[]) {
    const randomIndexes: number[] = [];
    if (this.running) return;
    this.running = true;

    //?
    const row = 2;

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      const randomIndex = Math.floor(Math.random() * column[i].length);
      const targetIndex = (r.position + randomIndex) % column[i].length;

      const target =
        r.position +
        column[i].length +
        (targetIndex - (r.position % column[i].length));

      const time = 3000 + i * 50 + randomIndex * 50;

      const symbol = this.getSymbol(column[i], targetIndex - row) + 1;
      randomIndexes.push(symbol);
      this.tweenTo({
        object: r,
        property: 'position',
        target,
        time,
        easing: backout(0.5),
        change: null,
        complete:
          i === this.reels.length - 1
            ? this.reelsComplete(randomIndexes)
            : null,
      });
    }
  }

  public reelsComplete(randomIndexes: number[]) {
    this.running = false;
    console.log('COMPLETE', randomIndexes);

    if (this.getResult(randomIndexes) === 1) {
      console.log('777 WINNNERRR!!');
      setTimeout(() => {
        engine().audio.sfx.play('main/sounds/sfx-win.mp3');
        engine().navigation.presentPopup(WinPopup);
      }, 3500);

      setTimeout(() => {
        engine().navigation.dismissPopup();
      }, 9500);
    } else if (
      this.getResult(randomIndexes) != undefined &&
      this.getResult(randomIndexes) < 11
    ) {
      console.log('Congrats You won');
      setTimeout(() => {
        engine().audio.sfx.play('main/sounds/sfx-win.mp3');
        engine().navigation.presentPopup(CongratsPopup);
      }, 3500);
      setTimeout(() => {
        engine().navigation.dismissPopup();
      }, 9500);
    } else {
      console.log('NO LUCK');
    }
  }

  public getSymbol(reel: Reel, targetIndex: number) {
    const index = targetIndex < 1 ? targetIndex + reel.length : targetIndex;
    return reel[reel.length - index];
  }

  private getResult(result: number[]) {
    const isAllSame = result.every((value) => value === result[0]);
    return isAllSame ? result[0] : 99;
  }

  private tweenTo(tweenOptions: Tween) {
    const { object, property, target, time, easing, change, complete } =
      tweenOptions;
    const tween = {
      object: object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: change,
      complete: complete,
      start: Date.now(),
    };
    this.tweening.push(tween);
  }
}
