const { execSync } = require('child_process');

const fs = require('fs');

const config = require('./config');

const extract = async() =>{
    console.time('mbtiles2pbf');
    if (!fs.existsSync(config.mbtiles)){
        console.log(`${config.mbtiles} does not exists. Skipped!`);
        return;
    }
    
    const cmd = `tile-join --force --no-tile-compression --output-to-directory=${config.ghpages} --no-tile-size-limit --name="${config.name}" --description="${config.description}" --attribution="${config.attribution}" ${config.mbtiles}`;

    execSync(cmd).toString();

    console.log(`tiles were extracted under ${config.ghpages}`);
    console.timeEnd('mbtiles2pbf');
};

module.exports = extract();