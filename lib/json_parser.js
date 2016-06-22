/**
 * Created by xzj on 2016/6/20 0020.
 */
"use strict"
const serverDetails3 = [
    'image',
    'links',
    'external_links',
    'extra_hosts',
    'ports',
    'expose',
    'volumes',
    'volumes_from',
    'environment',
    'labels',
    'log_driver',
    'net',
    'pid',
    'dns',
    'cap_add',
    'cap_drop',
    'dns_search',
    'devices',
    'security_opt',
    'working_dir',
    'entrypoint',
    'user',
    'hostname',
    'domainname',
    'mem_limit',
    'privileged',
    'restart',
    'stdin_open',
    'tty',
    'cpu_shares',
    'cpuset',
    'read_only'
];
var serverDetails = new Map([
    ['image', {Image: ''}],
    ['links', {
        NetworkingConfig: {
            EndpointsConfig: {
                isolated_nw: {
                    Links: ["container_1", "container_2"],
                    Aliases: ["server_x", "server_y"]
                }
            }
        }
    }],
    // ['external_links',],
    // ['extra_hosts',],
    ['ports', {
        HostConfig: {
            PortBindings: {
                "22/tcp": [{"HostPort": "11022"}]
            }
        }
    }],
    ['expose', {
        "ExposedPorts": {
            "22/tcp": {}
        }
    }],
    ['volumes',],
    ['volumes_from',],
    ['environment', {
        "Env": [
            "FOO=bar",
            "BAZ=quux"
        ]
    }],
    ['labels',],
    ['log_driver',],
    ['net',],
    ['pid',],
    ['dns',],
    ['cap_add',],
    ['cap_drop',],
    ['dns_search',],
    ['devices',],
    ['security_opt',],
    ['working_dir',],
    ['entrypoint',],
    ['user',],
    ['hostname',],
    ['domainname',],
    ['mem_limit',],
    ['privileged',],
    ['restart', {
        "HostConfig": {
            "RestartPolicy": {
                "Name": "unless-stopped"
            }
        }
    }],
    ['stdin_open',],
    ['tty',],
    ['cpu_shares',],
    ['cpuset',],
    ['read_only',]
]);
class ComposeParser {
    constructor(compose) {
        this.compose = compose;
        let serverNames = [];
        for (var i in this.compose) {
            serverNames.push(i);
        }
        this.serverNames = serverNames;
    }

    getServerNames() {
        let serverNames = [];
        for (let i in this.compose) {
            serverNames.push(i);
        }
        return serverNames;
    }

    getServerDetail() {
        var a = {};
        this.serverNames.forEach(name => {
            // serverDetails.forEach(detail => {
            //     if (compose[name][detail]) {
            //         console.log(name, detail, compose[name][detail]);
            //         let objname = detail,
            //             value = compose[name][detail];
            //
            //     }
            // });
            console.log('=========')
            for (let i in compose[name]) {
                serverDetails.get(i).Image=compose[name][i];
                console.log(serverDetails.get(i));
            }
        });

    }

}
var compose = {
    wordpress: {
        image: 'wordpress',
        links: ['db:mysql'],
        ports: ['80'],
        restart: 'always'
    },
    db: {
        image: 'mysql',
        environment: ['MYSQL_ROOT_PASSWORD=example'],
        restart: 'always'
    }
};
var c = new ComposeParser(compose);
var t = c.getServerNames();
c.getServerDetail();
console.log(t)

console.log(Object.assign({image: 1}, {links: [1, 2, 3]}))