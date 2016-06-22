/**
 * Created by xzj on 2016/6/20 0020.
 */
// var got = require('got');
// var swarmUrl = require('../setting').swarmUrl;
// got.get(swarmUrl+'/images/json?all=1')
//     .then(response => {
//         console.log(response.body);
//     }).catch(error => {
//     console.log(error.response.body);
// });
"use strict"
//类的定义
class Animal {
    //ES6中新型构造器
    constructor(name) {
        this.name = name;
    }

    //实例方法
    sayName() {
        console.log('My name is ' + this.name);
    }
}
//类的继承
class Programmer extends Animal {
    constructor(name) {
        //直接调用父类构造器进行初始化
        super(name);
    }

    program() {
        console.log("I'm coding...");
    }
}
//测试我们的类
var animal = new Animal('dummy'),
    wayou = new Programmer('wayou');
animal.sayName();//输出 ‘My name is dummy’
wayou.sayName();//输出 ‘My name is wayou’
wayou.program();//输出 ‘I'm coding...’