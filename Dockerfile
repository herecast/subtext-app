FROM node:7.0
RUN npm install -g bower
RUN mkdir -p /app
WORKDIR /app
ADD package.json /app
RUN npm install
ADD bower.json /app
RUN bower install --allow-root
ADD . /app/
# I am not sure why this is needed after adding subtext-ui... but it is
RUN npm install
