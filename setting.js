/**
 * 配置文件
 * Created by xzj on 2016/6/20 0020.
 */

var swarm = {
    host: process.env.SWARM_HOST || '192.168.1.240',
    port: process.env.SWARM_PORT || 3375
};

module.exports = {
    swarmUrl: swarm.host + ':' + swarm.port
}

