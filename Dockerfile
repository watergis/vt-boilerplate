# Start from ubuntu
FROM node:lts-bullseye

# Update repos and install dependencies
RUN apt-get update \
  && apt-get -y upgrade \
  && apt-get -y install \
  build-essential \
  libsqlite3-dev \
  zlib1g-dev \
  git

# Build tippecanoe
RUN mkdir -p /tmp/src
WORKDIR /tmp/src
RUN git clone https://github.com/felt/tippecanoe.git
WORKDIR /tmp/src/tippecanoe
RUN make \
    && make install

# Install postgis2mbtiles-docker
RUN mkdir -p /tmp/src
WORKDIR /tmp/src
COPY . /tmp/src
RUN npm install

RUN chmod a+x /tmp/src/entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]