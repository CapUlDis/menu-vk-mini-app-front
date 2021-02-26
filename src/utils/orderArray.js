module.exports = function orderArray(array, order, key) {
  array.sort(function (a, b) {
    let A = a[key]
    let B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }

  });

  return array;
}