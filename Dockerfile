# Start from ubuntu
FROM node:20 AS tippecanoe-builder

RUN apt-get update \
  && apt-get -y upgrade \
  && apt-get -y install \
  build-essential \
  libsqlite3-dev \
  zlib1g-dev \
  git

RUN git clone https://github.com/felt/tippecanoe.git
WORKDIR tippecanoe
RUN make

FROM node:20-slim

ARG db_user
ARG db_password
ARG db_host
ARG db_port
ARG db_name

RUN apt-get update \
  && apt-get -y upgrade \
  && apt-get -y install \
  libsqlite3-dev

COPY --from=tippecanoe-builder /tippecanoe/tippecanoe* /usr/local/bin/
COPY --from=tippecanoe-builder /tippecanoe/tile-join /usr/local/bin/

WORKDIR /tmp/src

# Install postgis2mbtiles-docker
COPY . /tmp/src
RUN npm install -g npm@latest
RUN npm install

RUN chmod a+x /tmp/src/entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]