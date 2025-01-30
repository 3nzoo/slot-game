// import { Container, Sprite, Texture } from 'pixi.js';
// // import { tweenTo } from './tweenUtils'; // Assuming you have a tweening function

// export class Reel extends Container {
//   public position: number;
//   public symbols: Sprite[];
//   private reelIndex: number;
//   private column: Texture[];
//   private running: boolean = false;

//   constructor(reelIndex: number, columnTextures: Texture[]) {
//     super();
//     this.reelIndex = reelIndex;
//     this.column = columnTextures;
//     this.position = 0;
//     this.symbols = [];

//     // Create symbols for the reel
//     for (let i = 0; i < columnTextures.length; i++) {
//       const symbol = new Sprite(columnTextures[i]);
//       symbol.y = i * 100; // Adjust symbol height
//       this.symbols.push(symbol);
//       this.addChild(symbol);
//     }
//   }

//   /** Start spinning the reel */
//   public spin(
//     targetIndex: number,
//     duration: number,
//     easing: Function,
//     onComplete?: Function
//   ) {
//     if (this.running) return;
//     this.running = true;

//     const target =
//       this.position +
//       this.column.length +
//       (targetIndex - (this.position % this.column.length));

//     // tweenTo(this, 'position', target, duration, easing, null, () => {
//     //   this.running = false;
//     //   if (onComplete) onComplete();
//     // });
//   }
// }
