/**
 * Created by xzj on 2016/6/21 0021.
 */
'use strict';
var _ = require('lodash');

/**
 * 端口解析方法
 * @param ports
 * @returns {
 *          port/protocol:{}
 *           }
 */
function getPorts(ports) {
    let exposedPorts = {};
    ports.forEach(p => {
        exposedPorts[p.port + '/' + p.protocol.toLowerCase()] = {};
    });
    return exposedPorts;
}

function getLinks(serverName) {
    let containerName = 'asd';
    let links = [];
    serverName.forEach(s=> {
        links.push(containerName + ':' + s)
    });
    return links
}
/**
 * 数据结构
 * @type {Map}
 */
const serverDetails = new Map([[
    'image', (value)=> {
        return {Image: value};
    }], [
    'links', (value)=> {
        return {HostConfig: {Links: getLinks(value)}}
    }], [
    'ports', (value)=> {
        return {HostConfig: {"PublishAllPorts": true}, ExposedPorts: getPorts(value)}
    }], [
    'environment', (value)=> {
        return {Env: value}
    }]
]);

/**
 * 解析器
 * @param key
 * @param value
 * @returns {*}
 */
function parser(key, value) {
    var func = serverDetails.get(key);
    if (func) {
        return func(value);
    }
    return null;
}

var compose = {
    wordpress: {
        image: 'tenxcloud/wordpress-stack:latest',
        links: ['mysql'],
        ports: [{port: 80, protocol: 'HTTP'}],
        // environment: ['WORDPRESS_DB_PASSWORD=pass']
    },
    mysql: {
        image: 'mysql',
        // ports: [{port: 3306, protocol: 'TCP'}],
        environment: ['MYSQL_ROOT_PASSWORD=test']
    }
};


module.exports = function multiCreateDatas(composeYml, callback) {
    let createDatas = new Map();
    let startList = {};
    for (let serverName  in compose) {
        let startFirst = [];
        let startLater = [];
        let createOption = {};
        for (let parameter in compose[serverName]) {
            createOption = _.defaultsDeep(createOption, parser(parameter, compose[serverName][parameter]));
        }
        createDatas.set(serverName, createOption);
        if (compose[serverName].links) {
            startLater.push(serverName);
            startFirst = compose[serverName].links;
            startList = {startFirst, startLater};
        }
    }
    createDatas.forEach((i)=> {
        console.dir(i);
    });
    console.log('===================');
    console.log(startList);
    return callback(startList, createDatas);
}