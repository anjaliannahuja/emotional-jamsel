FROM node:carbon

# Create app directory
WORKDIR /usr/src/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

ENV PROXY=http://server:3001

RUN yarn install
CMD ["yarn", "run", "start"]
