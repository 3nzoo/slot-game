// ! tweenTo;

import { Reel, Tween } from '../../app/types/interfaces';
// import { lerp } from './maths';

export function spinTo() {}

export function backOut(amount: number) {
  return function (t: number) {
    return --t * t * ((amount + 1) * t + amount) + 1;
  };
}
let tweening: Tween[] = [];
export function tweenTo(
  reel: Reel,
  property: string,
  target: number,
  time: number,
  easing: Function | null,
  onchange: Function | null,
  oncomplete: Function | null
) {
  const tween: Tween = {
    reel,
    property: property,
    propertyBeginValue: reel[property],
    target: target,
    easing: easing,
    time: time,
    change: onchange,
    complete: oncomplete,
    start: Date.now(),
  };

  tweening.push(tween);
  return tween;
}

// app.ticker.add(function () {
//   var now = Date.now();
//   var remove = [];
//   for (var i = 0; i < tweening.length; i++) {
//     var t: any = tweening[i];
//     var phase = Math.min(1, (now - t.start) / t.time);

//     t.object[t.property] = lerp(
//       t.propertyBeginValue,
//       t.target,
//       t.easing(phase)
//     );
//     if (t.change) t.change(t);
//     if (phase == 1) {
//       t.object[t.property] = t.target;
//       if (t.complete) t.complete(t);
//       remove.push(t);
//     }
//   }
//   for (var i = 0; i < remove.length; i++) {
//     tweening.splice(tweening.indexOf(remove[i]), 1);
//   }
// });
