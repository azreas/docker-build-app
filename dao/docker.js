/**
 * Created by xzj on 2016/6/24 0024.
 */
var request = require('request');
var swarmUrl = require('../setting').swarmUrl;

function createContainer(data, serverName, callback) {
    request.post('http://' + swarmUrl + '/containers/create?name=' + serverName, {
        body: data,
        json: true
    }, (error, response, body)=> {
        if (!error) {
            if (response.statusCode === 201) {
                callback(null, body);
            } else {
                callback(response.statusCode, body);
            }
        } else {
            callback(error);
        }
    });
}

function startContainer(containerId, callback) {
    request.post('http://' + swarmUrl + '/containers/' + containerId + '/start', (error, response, body)=> {
        if (!error) {
            if (response.statusCode === 204) {
                callback(null);
            } else {
                callback(response.statusCode, body);
            }
        } else {
            callback(error);
        }
    });
}



module.exports = {createContainer, startContainer};