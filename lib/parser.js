/**
 * Created by xzj on 2016/6/21 0021.
 */
'use strict';
var _ = require('lodash');

/**
 * 端口解析方法
 * @param ports
 * @returns {port/protocol:{}}
 */
function getPorts(ports) {
    let exposedPorts = {};
    ports.forEach(p => {
        exposedPorts[p.port + '/' + p.protocol.toLowerCase()] = {};
    });
    return exposedPorts;
}
/**
 * 服务关联解析方法
 * @param serverName
 * @returns {Array}
 */
function getLinks(serverNameList) {
    let containerName = 'mysql';
    let links = [];
    serverNameList.forEach(name=> {
        links.push(containerName + ':' + name)
    });
    return links
}
/**
 * 解析器数据结构
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
    console.log('key ' + key + ' not found')
    return null;
}

module.exports = function multiCreateDatas(name, composeYml, callback) {
    let createDatas = new Map();
    let startList = {};
    let startFirst = [];
    let startLater = [];
    for (let serverName  in composeYml) {
        let createOption = {
            "HostConfig": {
                "Binds": [
                    "/etc/localtime:/etc/localtime:ro"
                ],
                "RestartPolicy": {
                    "Name": "always"
                }
            }
        };
        for (let parameter in composeYml[serverName]) {
            createOption = _.defaultsDeep(createOption, parser(parameter, composeYml[serverName][parameter]));
        }
        if (composeYml[serverName].links) {
            startLater.push(serverName);
            startFirst = composeYml[serverName].links;
            startList = {startFirst, startLater};
        } else {
            startFirst.push(serverName);
            startList = {startFirst}
        }
        createDatas.set(serverName, createOption);
    }
    console.log(startList);
    createDatas.forEach(data=> {
        console.log(data);
    });
    return callback(startList, createDatas);
};