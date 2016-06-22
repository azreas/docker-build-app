/**
 * Created by xzj on 2016/6/20 0020.
 */
var got = require('got');
var swarmUrl = require('../setting').swarmUrl;
got('www.zerosky.cn')
    .then(response => {
        console.log(response.body);
    }).catch(error => {
    console.log(error.response.body);
});

got.post(swarmUrl).then()