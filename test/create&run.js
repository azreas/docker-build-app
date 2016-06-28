/**
 * Created by xzj on 2016/6/24 0024.
 */
var got = require('got');
var swarmUrl = require('../setting').swarmUrl;

var postdata = {
    Image: 'alexwhen/docker-2048',
    "ExposedPorts": {
        "8080/tcp": {}
    },
    "HostConfig": {
        "Binds": [
            "/etc/localtime:/etc/localtime:ro"
        ],
        "PublishAllPorts": true,
        "RestartPolicy": {
            "Name": "unless-stopped"
        },
        "MemoryReservation": 1024 * 1024 * 4,
        "NetworkMode": "xzj_net"
    }
};
function createContainer(postdata, callback) {
    got(swarmUrl + '/containers/create', {
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postdata),
        // json: true
    }).then(response => {
            console.log(response.body);
            console.log(JSON.parse(response.body).Id);

            callback(JSON.parse(response.body).Id);
        })
        .catch(error => {
            console.err(error.response.body);
        });
};
function runContainer(containerId, callback) {
    got.post(swarmUrl + '/containers/' + containerId + '/start', {
        headers: {
            "Content-Type": "application/json",
        },
        body: null
        // json: true
    }).then(response => {
            console.log(response.statusCode)
            if (response.statusCode !== 204) {
                callback('start container' + containerId + ' error ' + response.statusCode);
            } else {
                callback(null);
            }
            // callback(response.body.Id);
        })
        .catch(error => {
            console.err(error.response.body);
        });
}
// createContainer(postdata, (containerId)=> {
//     runContainer(containerId)
// });
try {
    runContainer('58907979ddd19b4f9dbb2ada8e0ae2403febcad63e9b4457154a06837092de42', err=> {
        console.log('err', err)
    });
} catch (e) {
    console.log(e)
}
