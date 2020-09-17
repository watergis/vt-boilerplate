# vt-boilerplate
![](https://github.com/narwassco/vt/workflows/Node.js%20CI/badge.svg)
![GitHub](https://img.shields.io/github/license/watergis/vt-boilerplate)
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/narwassco/vt)
![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/narwassco/vt)

This is a template to manage vectortiles for water services providers in Github pages. You can create your own `vt` repository by using this template repository.

Please also refer to [watergis/awesome-vector-tiles](https://github.com/watergis/awesome-vector-tiles). There is some instruction guide how to use tools and host your vectortiles in Github pages as open data.

## Configuration
All the settings are in `config.js` and `config-search.js`, so please make sure your own settings on this file before producing vector tile.

Please put environment variable for database settings.
```
db_user=$db_user
db_password=$db_password
db_host=host.docker.internal
db_port=5432
```

## Create mbtiles
### Usage (Docker)

```
db_user=your user db_password=your password docker-compose up
```

Your mbtiles will be generated under `data` directory. Your GeoJSON for searching window will also be generated under `public` directory.

### Usage (Nodejs)

#### Requirements

This module uses [`tippecanoe`](https://github.com/mapbox/tippecanoe) to convert geojson files to mbtiles. Please make sure to install it before running.

for MacOS
```
$ brew install tippecanoe
```

for Ubuntu
```
$ git clone https://github.com/mapbox/tippecanoe.git
$ cd tippecanoe
$ make -j
$ make install
```

Then,

```
$ npm install

$ db_user=$db_user \
  db_password=$db_password \
  db_host=localhost \
  db_port=5432 \
  npm run create
```

There will be two files as follows.
- ./data/rwss.mbtile
- ./public/wss.geojson

## Deployment from local computer

### Extract pbf (mvt) tiles from mbtiles file
please configure `config-extact.js` file to adjust output directory path and input mbtiles path.

```
npm run extract
```

There will be vectortiles under `./public/tiles` directory.

### Deploy

```
npm run deploy
```

It will publish all the files under `public` directory to Github Pages.

## Deployment by using Github Action

First, you can just generate and push both `data/data.mbtiles` and `public/meter.geojson` to master repository.

```bash
# the below commands are the same with create_vt.bat (create_vt.sh)
# generate data.mbtiles and meter.geojson
docker-compose up
# push data.mbtiles and meter.geojson to Github
git add .
git commit -m "update vectortiles"
git push origin master
```

Then, you can use Github Action for `npm run extract` and `npm run deploy` process. 

Here is the example of `.github/workflows/node.js.yml`. If you want to automate, please create it in your repository.

```yml
name: Node.js CI

on:
  push:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v1
      with:
        node-version: 12.x
    - run: npm ci
      env:
        NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
    - run: npm run extract
    - name: configure git and deploy
      env:
        NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
      run: |
        git config --global user.name "watergis+githubci"
        git config --global user.email "watergis+githubci@users.noreply.github.com"
        git remote set-url origin https://x-access-token:${NODE_AUTH_TOKEN}@github.com/{your organization name}/vt.git
        npm run deploy
```

# License

This source code under the repository is licensed by 
`MIT license`. You can use it freely for your purposes.

However, these data under [data](./data) and `gh-pages` branch are owned and maintained by `{your organization name}` in Kenya. It is under a [Creative Commons Attribution 4.0 International
License](http://creativecommons.org/licenses/by/4.0/), which is different from main repository. You can use this data freely, but please mention our credit `©{your organization name}` on attribution of your web application.

---
Copyright (c) 2020 Jin IGARASHI