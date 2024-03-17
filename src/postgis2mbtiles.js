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

    execSync(`tippecanoe -v`);

    const cmd = `
    tippecanoe \
    --no-feature-limit \
    --simplify-only-low-zooms \
    --detect-shared-borders \
    --read-parallel \
    --no-tile-size-limit \
    --no-tile-compression \
    --force \
    --name="${this.config.name}"  \
    --description="${this.config.description}" \
    --attribution="${this.config.attribution}" \
    -o ${mbtiles} ${geojsonfiles.join(' ')}`;

    console.log(cmd)

    execSync(cmd);

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