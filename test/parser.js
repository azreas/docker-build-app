/**
 * Created by xzj on 2016/6/21 0021.
 */
'use strict';

function a(xx) {
    this.b = xx;
}
var o = {};
a.apply(o, [5]);

console.log(a.b);    // undefined
console.log(o);    // 5