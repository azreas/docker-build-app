/**
 * Created by xzj on 2016/6/24 0024.
 */
'use strict'
var composeParser = require('../lib/parser');
var docker = require('../dao/docker');
var async = require('async');
var _ = require('lodash');

var compose = {
    wordpress: {
        image: 'wordpress',
        // links: ['mysql'],
        ports: [{port: 80, protocol: 'TCP'}],
        environment: ['WORDPRESS_DB_PASSWORD=test']
    },
    mysql: {
        image: 'mysql',
        ports: [{port: 3306, protocol: 'TCP'}],
        environment: ['MYSQL_ROOT_PASSWORD=test']
    }
};

function parallelStartContainer(list, createDatas, containerName, cb) {
    let networkConfig = {
        "HostConfig": {
            "NetworkMode": name
        }
    };
    list.forEach(serverName=> {
        let createParameter = createDatas.get(serverName);
        createParameter = _.defaultsDeep(createParameter, networkConfig);
        docker.createContainer(createParameter, containerName).then(res=> {
            console.log(res);
            return docker.startContainer(res.Id);
        }).then(res=> {
            console.log(res);
            cb(null);
        }).catch(e=> {
            cb('run container err ' + e);
        });
    });

}


function startByList(name, startList, createDatas) {

    let startFirst = startList.startFirst,
        startLater = startList.startLater,
        networkConfig = {
            "HostConfig": {
                "NetworkMode": name
            }
        };
    async.waterfall([
        waterfallCallback=> {
            docker.createNetwork(name).then(res=> {
                waterfallCallback(null);
            }).catch(e=> {
                waterfallCallback('createNetwork err ' + e);
            });
        },
        waterfallCallback=> {
            let startCount = 0;
            startFirst.forEach(serverName=> {
                let createParameter = createDatas.get(serverName);
                createParameter = _.defaultsDeep(createParameter, networkConfig);
                docker.createContainer(createParameter, serverName).then(res=> {
                    console.log(res);
                    return docker.startContainer(res.Id);
                }).then(res=> {
                    console.log(res);
                    startCount++;
                    if (startCount === startFirst.length) {
                        waterfallCallback(null);
                    }
                }).catch(e=> {
                    waterfallCallback('startFirst err ' + e);
                });
            });
        },
        waterfallCallback=> {
            if (startLater.length > 0) {
                let startCount = 0;
                startLater.forEach(serverName=> {
                    let createParameter = createDatas.get(serverName);
                    createParameter = _.defaultsDeep(createParameter, networkConfig);
                    docker.createContainer(createParameter, serverName).then(res=> {
                        console.log(res);
                        return docker.startContainer(res.Id);
                    }).then(res=> {
                        console.log(res);
                        startCount++;
                        if (startCount === startFirst.length) {
                            waterfallCallback(null);
                        }
                    }).catch(e=> {
                        waterfallCallback('startLater err ' + e);
                    });
                });
            } else {
                waterfallCallback(null);
            }
        }
    ], err=> {
        if (err) {
            console.error(err);
        }
    });


}

function serverCompose(composeJson) {
    let startFirst, startLater;
    composeParser(composeJson, (startList, createDatas)=> {
        startFirst = startList.startFirst;
        startLater = startList.startLater;

        startFirst.forEach(serverName=> {
            docker.createContainer(createDatas.get(serverName), serverName).then(respose=> {
                console.log(respose);
                return docker.startContainer(respose.Id);
            }).then(value=> {
                console.log(value);
            }).catch(e=> {
                console.log('err', e);
            });
        });
    });
}
let name = 'myserver';
composeParser(name, compose, (startList, createDatas)=> {
    // let startFirst = startList.startFirst;
    // let startLater = startList.startLater;
    startByList(name, startList, createDatas);
});