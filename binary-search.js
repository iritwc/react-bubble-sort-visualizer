export function BinarySearchSteps(item, arr) {

  function bindaryFind(item, left, right) {

    console.log('find', item, arr, left, right);
    if (left == right) {
      return (item == arr[left])? left: null;
    }

    const mid = Math.floor((left+right)/2);
    if (item <= arr[mid]) {
      return bindaryFind(item, left, mid);
    } else {
      return bindaryFind(item, mid+1, right);
    }

  }
  return bindaryFind(item, 0, arr.length);
}