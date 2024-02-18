const fs = require('fs');
const { execSync } =require('child_process');
const { postgis2geojson } = require('@watergis/postgis2geojson');

class postgis2mbtiles {
  constructor(config) {
    this.config = config;
  }

  async run() {
    const pg2json = new postgis2geojson(this.config);
    const geojsonfiles = await pg2json.run()
    const file = this.createMbtiles(geojsonfiles, this.config.mbtiles)
    return file
  }

  createMbtiles(geojsonfiles, mbtiles) {
    if (fs.existsSync(mbtiles)) {
      fs.unlinkSync(mbtiles);
    }
    const cmd = `tippecanoe -rg -z${this.config.maxzoom} -Z${
      this.config.minzoom
    } --name="${this.config.name}" --description="${this.config.description}" --attribution="${this.config.attribution}" -o ${mbtiles} ${geojsonfiles.join(' ')}`;

    execSync(cmd).toString();

    geojsonfiles.forEach((f) => {
      fs.unlinkSync(f);
    });
    console.log(
      `Creating voctor tile was done successfully at ${mbtiles}`
    );
    return mbtiles
  }
}

module.exports = postgis2mbtiles;