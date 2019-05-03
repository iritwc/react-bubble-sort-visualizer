export function BubbleSteps(arr) {
  let list = arr.slice(0);
  let length = list.length;
  let steps = [];
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length; j++) {
      if (i < j) {
        // 1. compare i,j
        steps.push({ action: 'compare', i, j });
        if (list[i] > list[j]) {
          // 2. swap i,j
          let itemi = list[i];
          list[i] = list[j];
          list[j] = itemi;
          steps.push({ action: 'swap-show', i, j });
          steps.push({ action: 'swap', i, j });
        }
      }
    }
  }
  return steps;
}