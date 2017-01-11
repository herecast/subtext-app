FROM node:7.0
RUN npm install -g bower
RUN mkdir -p /app
WORKDIR /app
ADD package.json /app
RUN npm install
ADD bower.json /app
RUN bower install --allow-root
ADD . /app/
RUN /app/node_modules/.bin/ember build --environment=production
CMD ["node", "fastboot-app.js"]
