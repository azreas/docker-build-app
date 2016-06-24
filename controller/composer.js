/**
 * Created by xzj on 2016/6/24 0024.
 */
'use strict'
var composeParser = require('../lib/parser');
var docker = require('../dao/docker');
var compose = {
    wordpress: {
        image: 'wordpress',
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

docker.startContainer('abc', (error, msg) => {
    console.log(error);
    console.log(msg);
});

function serverCompose(composeJson) {
    let startFirst, startLater;
    composeParser(composeJson, (startList, createDatas)=> {
        startFirst = startList.startFirst;
        startLater = startList.startLater;

        startFirst.forEach(serverName=> {
            docker.createContainer(createDatas.get(serverName), serverName, (err, body)=> {
                console.log(err);
                console.log(body);
            })
        })
    });
}
serverCompose(compose);