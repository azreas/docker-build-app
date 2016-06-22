/**
 * Created by xzj on 2016/6/21 0021.
 */
'use strict';
var _ = require('lodash');
function getPorts(ports) {
    var exposedPorts = {};
    ports.forEach(p => {
        exposedPorts[p.port + '/' + p.protocol.toLowerCase()] = {};
    });
    return exposedPorts;
};
const serverDetails = new Map([[
    'image', (value)=> {
        return {Image: value};
    }], [
    'links', (value)=> {
        return {HostConfig: {Links: value}}
    }], [
    'ports', (value)=> {
        return {
            ExposedPorts: getPorts(value)
        }
    }], [
    'environment', (value)=> {
        return {
            Env: value
        }
    }]
]);

function paser(key, value) {
    var func = serverDetails.get(key);
    if (func) {
        return func(value);
    }
    return null;
};
var compose = {
    wordpress: {
        image: 'tenxcloud/wordpress-stack:latest',
        links: ['mysql'],
        ports: [{port: 80, protocol: 'HTTP'}],
        environment: ['WORDPRESS_DB_PASSWORD=pass']
    },
    mysql: {
        image: 'docker_library/mysql:latest',
        ports: [{port: 3306, protocol: 'TCP'}],
        environment: ['RACK_ENV=development', 'a=b']
    }
};
try {
    for (let i  in compose) {
        var creatOption = {
            "HostConfig": {
                "PublishAllPorts": true
            }
        };
        for (let j in compose[i]) {
            creatOption = _.defaultsDeep(creatOption, paser(j, compose[i][j]));
        }
        console.log(JSON.stringify(creatOption));
    }
} catch (e) {
    console.log(e);
}

