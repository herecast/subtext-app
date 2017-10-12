FROM node:7.4
RUN npm install -g bower
RUN npm install -g npm@5.3.0
RUN mkdir -p /app
WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm install
ADD bower.json /app
RUN bower install --allow-root
ADD . /app/
RUN /app/node_modules/.bin/ember build --environment=production
VOLUME ["/app/public"]
CMD ["node", "fastboot-app.js"]
