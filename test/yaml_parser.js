/**
 * Created by xzj on 2016/6/17 0017.
 */
var yaml = require('js-yaml');
var fs = require('fs');

// Get document, or throw exception on error
try {
    var doc = yaml.safeLoad(fs.readFileSync('d://yaml/docker-compose.yml', 'utf8'));
    console.log(doc);
} catch (e) {
    console.log(e);
}