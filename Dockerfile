FROM node:10
WORKDIR /usr/src/app
# COPY package*.json ./
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install
# RUN npm install -g nodemon  # uncomment if in dev env

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/src/app
EXPOSE 5000
CMD ["node", "server.js"]