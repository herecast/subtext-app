FROM node:8.9
RUN npm install -g bower yarn
RUN mkdir -p /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn install
ADD bower.json /app
RUN bower install --allow-root
ADD . /app/
RUN /app/node_modules/.bin/ember build --environment=production
VOLUME ["/app/public"]
CMD ["node", "fastboot-app.js"]
