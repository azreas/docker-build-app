/**
 * 配置文件
 * Created by xzj on 2016/6/20 0020.
 */

var swarm = {
    host: process.env.SWARM_HOST || '121.201.18.171',
    port: process.env.SWARM_PORT || 3375
};

module.exports = {
    swarmUrl: swarm.host + ':' + swarm.port
}

